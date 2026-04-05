import { useState } from "react";
import {
  Background,
  type Edge,
  Controls,
  MiniMap,
  type Node,
  ReactFlow,
  ReactFlowProvider,
} from "reactflow";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Fuse from "fuse.js";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  CalendarRange,
  Database,
  FileStack,
  Landmark,
  Menu,
  Search,
  Users,
} from "lucide-react";
import "reactflow/dist/style.css";

import { CourtArgumentCard } from "@/components/court-argument-card";
import { LegendItem } from "@/components/legend-item";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courtSessions,
  documents,
  glossary,
  latestUpdates,
  organizations,
  overviewCards,
  people,
  phaseCards,
  searchRecords,
  siteMeta,
  sources,
  statements,
  timelineEvents,
} from "@/data/prototype-data";
import { graphEdges, graphNodes } from "@/lib/prototype-graph";

const navItems = [
  { id: "home", label: "首頁" },
  { id: "timeline", label: "案情總覽" },
  { id: "entities", label: "人物與機構" },
  { id: "court", label: "法庭與證詞" },
  { id: "official", label: "官方資料" },
  { id: "discourses", label: "輿論與論述" },
  { id: "glossary", label: "名詞與延伸" },
  { id: "graph", label: "關聯圖譜" },
  { id: "sources", label: "來源庫" },
];

type DetailPayload = {
  eyebrow: string;
  title: string;
  description?: string;
  sections: Array<{ label: string; content: string | string[] }>;
};

const fuse = new Fuse(searchRecords, {
  includeScore: true,
  threshold: 0.28,
  keys: ["title", "summary", "tags"],
});

const documentColumns: ColumnDef<(typeof documents)[number]>[] = [
  { accessorKey: "title", header: "文件名稱" },
  { accessorKey: "issuer", header: "發布單位" },
  { accessorKey: "date", header: "日期" },
  { accessorKey: "type", header: "類型" },
  { accessorKey: "theme", header: "關聯主題" },
];

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function normalizeText(input: string | string[]) {
  return Array.isArray(input) ? input : [input];
}

function buildSearchDetail(record: (typeof searchRecords)[number]): DetailPayload {
  return {
    eyebrow: `搜尋結果 / ${record.kind}`,
    title: record.title,
    description: record.summary,
    sections: [
      { label: "標籤", content: record.tags },
      {
        label: "來源",
        content: record.source ?? "此筆搜尋結果目前沒有直接原始網址欄位，prototype 先保留來源占位。",
      },
    ],
  };
}

function buildTimelineDetail(item: (typeof timelineEvents)[number]): DetailPayload {
  return {
    eyebrow: `${item.date} / ${item.type}`,
    title: item.title,
    description: item.summary,
    sections: [
      { label: "關聯節點", content: item.related },
      { label: "是否為關鍵節點", content: item.key ? "是" : "否" },
    ],
  };
}

function buildPersonDetail(item: (typeof people)[number]): DetailPayload {
  return {
    eyebrow: `${item.kind} / ${item.affiliation}`,
    title: item.name,
    description: item.role,
    sections: [{ label: "關聯庭期", content: item.relatedSessions }],
  };
}

function buildOrganizationDetail(
  item: (typeof organizations)[number],
): DetailPayload {
  return {
    eyebrow: `${item.type}`,
    title: item.name,
    description: item.role,
    sections: [{ label: "角色定位", content: item.role }],
  };
}

function buildCourtSessionDetail(
  item: (typeof courtSessions)[number],
): DetailPayload {
  return {
    eyebrow: `${item.date} / ${item.type}`,
    title: item.court,
    description: item.highlights,
    sections: [
      { label: "檢方主張", content: item.prosecution },
      { label: "辯方主張", content: item.defense },
      { label: "出庭證人", content: item.witnesses },
    ],
  };
}

function buildDocumentDetail(item: (typeof documents)[number]): DetailPayload {
  return {
    eyebrow: `${item.issuer} / ${item.type}`,
    title: item.title,
    description: item.summary,
    sections: [
      { label: "日期", content: item.date },
      { label: "關聯主題", content: item.theme },
      { label: "原始連結", content: item.url },
    ],
  };
}

function buildStatementDetail(item: (typeof statements)[number]): DetailPayload {
  return {
    eyebrow: `${item.speaker} / ${item.type}`,
    title: item.position,
    description: item.summary,
    sections: [{ label: "日期", content: item.date }],
  };
}

function buildGlossaryDetail(item: (typeof glossary)[number]): DetailPayload {
  return {
    eyebrow: `${item.type}`,
    title: item.term,
    description: item.definition,
    sections: [{ label: "與案件關聯", content: item.relevance }],
  };
}

function buildSourceDetail(item: (typeof sources)[number]): DetailPayload {
  return {
    eyebrow: `${item.publisher} / ${item.type}`,
    title: item.title,
    description: `${item.date} / 可信度 ${item.credibility}`,
    sections: [
      { label: "來源資訊", content: [item.publisher, item.date, item.type] },
      { label: "原始連結", content: item.url },
    ],
  };
}

function getPhaseIcon(accent: string) {
  switch (accent) {
    case "slate":
      return CalendarRange;
    case "amber":
      return Users;
    case "indigo":
      return Landmark;
    case "emerald":
      return FileStack;
    case "rose":
      return BookOpen;
    default:
      return Database;
  }
}

const heroNodes: Node[] = graphNodes;
const heroEdges: Edge[] = graphEdges;

function App() {
  const [activeEntityTab, setActiveEntityTab] = useState("people");
  const [activeSessionId, setActiveSessionId] = useState(courtSessions[0]?.id ?? "");
  const [detail, setDetail] = useState<DetailPayload | null>(null);
  const [query, setQuery] = useState("");

  const table = useReactTable({
    data: documents,
    columns: documentColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const searchResults = query.trim()
    ? fuse.search(query.trim()).slice(0, 6).map((item) => item.item)
    : [];

  const activeSession =
    courtSessions.find((session) => session.id === activeSessionId) ?? courtSessions[0];

  const entityCards = activeEntityTab === "people" ? people : organizations;

  return (
    <ReactFlowProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
            <button
              className="flex items-center gap-3 text-left"
              onClick={() => scrollToSection("home")}
            >
              <div className="rounded-2xl border border-primary/15 bg-primary/10 p-2 text-primary">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  案件研究資料庫 prototype
                </div>
                <div className="text-lg font-semibold">{siteMeta.title}</div>
              </div>
            </button>

            <nav className="hidden items-center gap-5 lg:flex">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className="text-sm text-muted-foreground transition hover:text-foreground"
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden" />}>
                  <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] max-w-sm">
                <SheetHeader>
                  <SheetTitle>主題導覽</SheetTitle>
                </SheetHeader>
                <div className="mt-8 grid gap-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => scrollToSection(item.id)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main>
          <section id="home" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-8">
                <div className="space-y-6">
                  <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs tracking-[0.22em] uppercase">
                    獨立資料庫網站雛形
                  </Badge>
                  <div className="space-y-4">
                    <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
                      以六階段研究脈絡承接案件資料，讓閱讀、檢索與關聯探索同時成立。
                    </h1>
                    <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                      {siteMeta.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="relative max-w-2xl">
                      <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="搜尋人物、庭期、文件、關鍵詞或制度名詞"
                        className="h-12 rounded-full border-border/70 bg-card pl-11 text-sm shadow-sm"
                      />

                      <AnimatePresence>
                        {searchResults.length > 0 ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute inset-x-0 top-[calc(100%+0.75rem)] z-30"
                          >
                            <Card className="overflow-hidden border-border/70 shadow-[0_18px_48px_rgba(26,22,18,0.12)]">
                              <ScrollArea className="max-h-80">
                                <div className="grid gap-1 p-2">
                                  {searchResults.map((item) => (
                                    <button
                                      key={item.id}
                                      className="rounded-xl px-4 py-3 text-left transition hover:bg-muted/70"
                                      onClick={() => setDetail(buildSearchDetail(item))}
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <div className="font-medium">{item.title}</div>
                                        <Badge variant="outline">{item.kind}</Badge>
                                      </div>
                                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        {item.summary}
                                      </p>
                                    </button>
                                  ))}
                                </div>
                              </ScrollArea>
                            </Card>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {phaseCards.map((card) => (
                        <Button
                          key={card.id}
                          variant="outline"
                          className="rounded-full border-border/70 bg-card/70"
                          onClick={() => scrollToSection(card.id === "overview" ? "timeline" : card.id)}
                        >
                          {card.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {overviewCards.map((card) => (
                    <Card key={card.label} className="border-border/70 bg-card/95">
                      <CardContent className="p-5">
                        <div className="text-sm text-muted-foreground">{card.label}</div>
                        <div className="mt-3 text-3xl font-semibold tracking-tight">{card.value}</div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.detail}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="border-border/70 bg-card/95 shadow-[0_24px_80px_rgba(37,30,20,0.08)]">
                <CardHeader className="space-y-5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm tracking-[0.2em] text-muted-foreground uppercase">
                        關聯圖譜預覽
                      </div>
                      <CardTitle className="mt-2 text-2xl leading-tight">
                        先用圖理解人物、機構、事件與文件的關聯，再往下進入六個主題頁。
                      </CardTitle>
                    </div>
                    <Badge className="rounded-full bg-primary/12 text-primary hover:bg-primary/12">
                      React Flow
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <LegendItem label="人物" tone="#d6bc8a" />
                    <LegendItem label="機構" tone="#aab69a" />
                    <LegendItem label="事件" tone="#b5addb" />
                    <LegendItem label="文件" tone="#d2ad97" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 px-6 pb-6">
                  <div className="h-[320px] overflow-hidden rounded-[24px] border border-border/70 bg-[#faf7f1]">
                    <ReactFlow
                      nodes={heroNodes}
                      edges={heroEdges}
                      fitView
                      proOptions={{ hideAttribution: true }}
                      nodesConnectable={false}
                      nodesDraggable={false}
                      elementsSelectable={false}
                      panOnDrag={false}
                      zoomOnScroll={false}
                    >
                      <Background gap={24} color="#ebe1d5" />
                    </ReactFlow>
                  </div>

                  <div className="grid gap-3">
                    {latestUpdates.map((item) => (
                      <button
                        key={item.id}
                        className="rounded-2xl border border-border/70 bg-background px-4 py-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
                        onClick={() =>
                          setDetail({
                            eyebrow: item.label,
                            title: item.title,
                            description: item.detail,
                            sections: [
                              {
                                label: "定位",
                                content:
                                  "此區塊用來承接之後新加入的庭期、文件、聲明與詞條，讓首頁永遠有最新資料入口。",
                              },
                            ],
                          })
                        }
                      >
                        <div className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                          {item.label}
                        </div>
                        <div className="mt-2 text-sm font-medium leading-6">{item.title}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
            <div className="grid gap-5 lg:grid-cols-3">
              {phaseCards.map((card) => {
                const Icon = getPhaseIcon(card.accent);
                return (
                  <motion.button
                    key={card.id}
                    whileHover={{ y: -4 }}
                    className="rounded-[28px] border border-border/70 bg-card/90 p-6 text-left shadow-[0_16px_48px_rgba(22,18,14,0.06)] transition"
                    onClick={() => scrollToSection(card.id === "overview" ? "timeline" : card.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="rounded-2xl border border-border/70 bg-muted/60 p-3 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="rounded-full">
                        {card.count}
                      </Badge>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {card.description}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                      進入此主題
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section id="timeline" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <SectionHeading
              eyebrow="Phase 01"
              title="案情總覽與時間軸"
              description="把案件的發展歷程拆成可閱讀的時間節點，後續每一筆研究成果都能掛回相應事件。"
            />
            <div className="mt-10 grid gap-4">
              {timelineEvents.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 3 }}
                  className="grid gap-4 rounded-[28px] border border-border/70 bg-card/90 p-6 text-left md:grid-cols-[160px_1fr_260px]"
                  onClick={() => setDetail(buildTimelineDetail(item))}
                >
                  <div>
                    <div className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                      {item.type}
                    </div>
                    <div className="mt-2 text-2xl font-semibold">{item.date}</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {item.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap content-start gap-2">
                    {item.related.map((relation) => (
                      <Badge key={relation} variant="outline" className="rounded-full">
                        {relation}
                      </Badge>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          <section id="entities" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <SectionHeading
              eyebrow="Phase 02"
              title="人物與機構"
              description="以卡片和詳情側欄承接人物、證人、機構與角色節點，之後可以逐步擴成完整百科。"
            />
            <Tabs
              value={activeEntityTab}
              onValueChange={setActiveEntityTab}
              className="mt-10 gap-6"
            >
              <TabsList>
                <TabsTrigger value="people">人物</TabsTrigger>
                <TabsTrigger value="organizations">機構</TabsTrigger>
              </TabsList>
              <TabsContent value="people">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {entityCards.map((item) => (
                    <Card
                      key={item.id}
                      className="border-border/70 bg-card/95 transition hover:border-primary/30"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="text-lg font-semibold">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {"affiliation" in item ? item.affiliation : item.type}
                            </div>
                          </div>
                          <Badge variant="outline" className="rounded-full">
                            {"kind" in item ? item.kind : item.type}
                          </Badge>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">
                          {"role" in item ? item.role : ""}
                        </p>
                        <Button
                          variant="ghost"
                          className="mt-5 px-0 text-primary"
                          onClick={() =>
                            setDetail(
                              activeEntityTab === "people"
                                ? buildPersonDetail(item as (typeof people)[number])
                                : buildOrganizationDetail(item as (typeof organizations)[number]),
                            )
                          }
                        >
                          查看詳情
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="organizations">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {entityCards.map((item) => (
                    <Card
                      key={item.id}
                      className="border-border/70 bg-card/95 transition hover:border-primary/30"
                    >
                      <CardContent className="p-6">
                        <div className="space-y-1">
                          <div className="text-lg font-semibold">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {(item as (typeof organizations)[number]).type}
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">
                          {(item as (typeof organizations)[number]).role}
                        </p>
                        <Button
                          variant="ghost"
                          className="mt-5 px-0 text-primary"
                          onClick={() =>
                            setDetail(
                              buildOrganizationDetail(item as (typeof organizations)[number]),
                            )
                          }
                        >
                          查看詳情
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>

          <section id="court" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <SectionHeading
              eyebrow="Phase 03"
              title="法庭與證詞"
              description="以庭期為主軸，再向下展開檢辯攻防與證人證詞摘要，保持研究向但不做情緒化表演。"
            />
            <div className="mt-10 grid gap-6 xl:grid-cols-[300px_1fr]">
              <div className="grid gap-3">
                {courtSessions.map((session) => (
                  <button
                    key={session.id}
                    className={`rounded-[24px] border p-5 text-left transition ${
                      session.id === activeSession.id
                        ? "border-primary/35 bg-primary/8"
                        : "border-border/70 bg-card/90 hover:border-primary/20"
                    }`}
                    onClick={() => setActiveSessionId(session.id)}
                  >
                    <div className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                      {session.type}
                    </div>
                    <div className="mt-2 text-xl font-semibold">{session.date}</div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {session.highlights}
                    </p>
                  </button>
                ))}
              </div>

              <Card className="border-border/70 bg-card/95">
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">{activeSession.court}</div>
                      <CardTitle className="mt-2 text-3xl">{activeSession.date}</CardTitle>
                    </div>
                    <Button variant="outline" onClick={() => setDetail(buildCourtSessionDetail(activeSession))}>
                      展開庭期摘要
                    </Button>
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {activeSession.highlights}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <CourtArgumentCard
                      label="檢方主張"
                      content={activeSession.prosecution}
                      tone="primary"
                    />
                    <CourtArgumentCard
                      label="辯方主張"
                      content={activeSession.defense}
                      tone="secondary"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="text-sm font-medium">出庭證人</div>
                    <div className="flex flex-wrap gap-2">
                      {activeSession.witnesses.map((witness) => (
                        <Badge key={witness} variant="outline" className="rounded-full">
                          {witness}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="official" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <SectionHeading
              eyebrow="Phase 04"
              title="官方與法理資料"
              description="這一頁像文件中樞，先把官方報告、行政檢討、法條與修法節點整理成結構化資料表。"
            />
            <Card className="mt-10 border-border/70 bg-card/95">
              <CardHeader className="gap-3">
                <CardTitle className="text-2xl">官方文件總覽</CardTitle>
                <p className="text-sm leading-7 text-muted-foreground">
                  Prototype 先放文件表格與點擊詳情邏輯，後續可以再補發布單位、日期與主題的多重篩選。
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer"
                        onClick={() =>
                          setDetail(buildDocumentDetail(row.original))
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {String(cell.getValue() ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          <section id="discourses" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <SectionHeading
              eyebrow="Phase 05"
              title="輿論光譜與多元論述"
              description="不做情緒牆，而是把工會聲明、機構回應、倡議行動與社會反應拆成可對照的資料卡。"
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {statements.map((statement) => (
                <motion.button
                  key={statement.id}
                  whileHover={{ y: -4 }}
                  className="rounded-[28px] border border-border/70 bg-card/95 p-6 text-left"
                  onClick={() => setDetail(buildStatementDetail(statement))}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                        {statement.type}
                      </div>
                      <div className="text-lg font-semibold">{statement.speaker}</div>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      {statement.date}
                    </Badge>
                  </div>
                  <h3 className="mt-5 text-base font-semibold">{statement.position}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {statement.summary}
                  </p>
                </motion.button>
              ))}
            </div>
          </section>

          <section id="glossary" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <SectionHeading
              eyebrow="Phase 06"
              title="名詞與延伸資料"
              description="讓整個站不只是資料展示，而是能把制度、法理與實務名詞逐步收斂成可查的詞典。"
            />
            <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_0.92fr]">
              <div className="grid gap-4 md:grid-cols-2">
                {glossary.map((item) => (
                  <Card
                    key={item.id}
                    className="border-border/70 bg-card/95 transition hover:border-primary/25"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-lg font-semibold">{item.term}</div>
                        <Badge variant="outline" className="rounded-full">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-muted-foreground">
                        {item.definition}
                      </p>
                      <Button
                        variant="ghost"
                        className="mt-5 px-0 text-primary"
                        onClick={() => setDetail(buildGlossaryDetail(item))}
                      >
                        查看詞條
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card id="sources" className="border-border/70 bg-card/95">
                <CardHeader className="gap-3">
                  <CardTitle className="text-2xl">來源庫</CardTitle>
                  <p className="text-sm leading-7 text-muted-foreground">
                    每一筆資料都應該可追回原始來源。Prototype 先把來源卡、可信度與後續引用關係的位置留好。
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sources.map((item) => (
                    <button
                      key={item.id}
                      className="w-full rounded-[22px] border border-border/70 bg-background p-4 text-left transition hover:border-primary/30"
                      onClick={() => setDetail(buildSourceDetail(item))}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {item.publisher} / {item.date}
                          </div>
                        </div>
                        <Badge className="rounded-full bg-primary/12 text-primary hover:bg-primary/12">
                          {item.credibility}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="graph" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <SectionHeading
              eyebrow="Graph Lab"
              title="關聯圖譜"
              description="這一頁是之後最有辨識度的地方：人物、機構、事件與文件可以不只被閱讀，也可以被探索。"
            />
            <Card className="mt-10 overflow-hidden border-border/70 bg-card/95">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <LegendItem label="人物" tone="#d6bc8a" />
                  <LegendItem label="機構" tone="#aab69a" />
                  <LegendItem label="事件" tone="#b5addb" />
                  <LegendItem label="文件" tone="#d2ad97" />
                  <LegendItem label="庭期" tone="#9fb2c3" />
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  第一版先用人物－機構－事件－文件關聯圖，後續再擴成庭期－證詞－爭點圖與政策回應圖。
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[560px] bg-[#f7f2ea]">
                  <ReactFlow
                    nodes={graphNodes}
                    edges={graphEdges}
                    fitView
                    proOptions={{ hideAttribution: true }}
                  >
                    <MiniMap pannable zoomable />
                    <Controls showInteractive={false} />
                    <Background gap={22} color="#ece1d3" />
                  </ReactFlow>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mx-auto max-w-7xl px-4 pt-4 pb-20 md:px-6">
            <Card className="border-border/70 bg-primary/[0.06]">
              <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl space-y-3">
                  <div className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                    方法說明
                  </div>
                  <h3 className="text-2xl font-semibold">
                    這個雛形的任務不是先寫滿內容，而是先把六階段研究成果能安穩落點的骨架建立起來。
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    下一步可以直接把研究工作區中的條目逐步轉成資料表，再補上篩選、引用與交叉對照，不需要重做整站 IA。
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => scrollToSection("home")}>回到頂部</Button>
                  <Button variant="outline" onClick={() => scrollToSection("sources")}>
                    查看來源庫
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        <Sheet open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}>
          <SheetContent side="right" className="w-[92vw] max-w-2xl">
            {detail ? (
              <>
                <SheetHeader className="border-b border-border/70 pb-4">
                  <div className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                    {detail.eyebrow}
                  </div>
                  <SheetTitle className="text-2xl leading-tight">{detail.title}</SheetTitle>
                  {detail.description ? (
                    <p className="text-sm leading-7 text-muted-foreground">{detail.description}</p>
                  ) : null}
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="space-y-6 p-4">
                    {detail.sections.map((section) => (
                      <div key={section.label} className="space-y-3">
                        <div className="text-sm font-semibold">{section.label}</div>
                        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
                          {normalizeText(section.content).map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : null}
          </SheetContent>
        </Sheet>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
