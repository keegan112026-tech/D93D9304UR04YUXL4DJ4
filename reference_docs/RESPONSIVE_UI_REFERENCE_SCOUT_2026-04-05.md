# Responsive UI 參考武器庫

建立日期：2026-04-05  
用途：整理適合本專案的桌機 / 手機雙端 UI 參考來源，作為後續首頁、導覽、工作檯、閱讀頁的優化武器庫。  
性質：**Reference only**。只做查找與判讀，不代表立即採用。

## 使用原則

1. 優先參考與本專案技術棧相近的來源：
   - Next.js
   - React
   - Tailwind
   - shadcn/ui / Radix
2. 只借用：
   - 互動模式
   - 響應式結構
   - 留白與閱讀節奏
   - 手機/桌機切換策略
3. 不直接照搬品牌、字體、色彩。
4. 若元件偏炫技，僅限首頁微動態或局部引導，不進入正式閱讀主區。

## A. 手機導覽 / 抽屜 / 底部面板

### 1. emilkowalski/vaul
- Repo: [https://github.com/emilkowalski/vaul](https://github.com/emilkowalski/vaul)
- 類型：React Drawer / Bottom Sheet
- 最適合參考：
  - 手機版導覽抽屜
  - 手機版工作檯的次級操作面板
  - 需要不離頁的輕量資訊面板
- 對本專案的價值：
  - `/sessions/[id]` 手機版後續若還要加「引用列表 / 投稿說明 / 審核提示」，Vaul 的互動模式比硬塞進頁面更穩。
- 注意：
  - 先借互動思路，不代表要直接引入套件。

### 2. shadcn-ui/ui
- Repo: [https://github.com/shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- 類型：元件基底庫
- 最適合參考：
  - 手機漢堡選單
  - Tabs / Sheet / Drawer / Collapsible
  - 空狀態與載入狀態
- 對本專案的價值：
  - 現在 `SubpageHeader` 已用到 sheet，後續手機導覽延伸成本最低。

### 3. radix-ui/primitives
- Repo: [https://github.com/radix-ui/primitives](https://github.com/radix-ui/primitives)
- 類型：可及性 primitive
- 最適合參考：
  - 手機 menu / dialog / tabs / popover 的焦點管理
- 對本專案的價值：
  - 若之後我們要做更精緻的手機操作層，Radix 的行為模型很值得回源頭看。

## B. 首頁 / 行銷型區塊 / 雙端節奏

### 4. shadcn-ui/taxonomy
- Repo: [https://github.com/shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy)
- 類型：內容型站點範例
- 最適合參考：
  - 首頁 Hero 與內容區的節奏
  - 卡片入口如何在手機與桌機維持一致層級
- 對本專案的價值：
  - 首頁現在已接近完成度，但 Hero / 中段還能再收。Taxonomy 很適合看「怎麼讓內容型首頁不碎裂」。

### 5. haydenbleasel/kibo
- Repo: [https://github.com/haydenbleasel/kibo](https://github.com/haydenbleasel/kibo)
- 類型：shadcn/ui composable blocks
- 最適合參考：
  - 行銷區塊
  - 卡片型資訊呈現
  - 行動裝置友善的 CTA 結構
- 對本專案的價值：
  - 可作為首頁區塊質感與 blocks 組織的補充靈感來源。
- 注意：
  - 只參考 block 思路，不照搬視覺語氣。

### 6. magicuidesign/magicui
- Repo: [https://github.com/magicuidesign/magicui](https://github.com/magicuidesign/magicui)
- 類型：動畫與視覺組件庫
- 最適合參考：
  - Hero 微動態
  - 漸層、shimmer、輕量動畫
  - 卡片切換節奏
- 對本專案的價值：
  - 可支援首頁「安全增色」，尤其是桌機 hero 與手機 hero 的動態層次。
- 注意：
  - 本專案不適合過度炫技，僅適合作為局部增色參考。

## C. 工作檯 / 編輯器 / 分欄與切換

### 7. bvaughn/react-resizable-panels
- Repo: [https://github.com/bvaughn/react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)
- 類型：桌面工作區雙欄 / 多欄模式
- 最適合參考：
  - `/sessions/[id]` 桌面版工作檯
  - 左右分欄與保存尺寸策略
- 對本專案的價值：
  - 已在用，後續優化應先參考官方思路，而不是自己硬拗行為。
- 注意：
  - 手機不應沿用同一套分欄模型。

### 8. ueberdosis/tiptap
- Repo: [https://github.com/ueberdosis/tiptap](https://github.com/ueberdosis/tiptap)
- 類型：編輯器框架
- 最適合參考：
  - 引用 chip
  - 編輯器 placeholder
  - bubble menu / floating menu
  - 手機編輯器互動
- 對本專案的價值：
  - 工作檯是本專案核心之一，Tiptap 官方 examples 很值得持續回頭看。

### 9. pacocoursey/cmdk
- Repo: [https://github.com/pacocoursey/cmdk](https://github.com/pacocoursey/cmdk)
- 類型：命令選單 / 搜尋面板
- 最適合參考：
  - 如果未來要做「快速跳行」、「快速搜尋段落」、「快速插入引用」
- 對本專案的價值：
  - 很適合作為工作檯後續進階工具的參考，不必立刻上。

## D. 輪轉 / 櫥窗 / 手機滑動體驗

### 10. davidjerleke/embla-carousel
- Repo: [https://github.com/davidjerleke/embla-carousel](https://github.com/davidjerleke/embla-carousel)
- 類型：Carousel / swipe interaction
- 最適合參考：
  - 首頁或 `/sessions` 的固定高度櫥窗
  - 手機滑動卡片
  - 不干擾版面的輪轉內容
- 對本專案的價值：
  - 你之前很在意「輪轉櫥窗」而不是把內容整塊拉長，Embla 很適合拿來當這類 UI 的穩定參考。
- 注意：
  - 先借用輪轉與 swipe 模式，不一定需要直接安裝。

## E. 文件頁 / 知識頁的雙端閱讀

### 11. fuma-nama/fumadocs
- Repo: [https://github.com/fuma-nama/fumadocs](https://github.com/fuma-nama/fumadocs)
- 類型：React / Next.js 文件框架
- 最適合參考：
  - `/guide`
  - `/knowledge`
  - 長文閱讀在手機與桌機的章節導覽
- 對本專案的價值：
  - 本專案需要很強的「說明能力」，而不只是展示頁。Fumadocs 在 docs-style 閱讀體驗上很有參考價值。

### 12. fuma-nama/fumadocs-ui-template
- Repo: [https://github.com/fuma-nama/fumadocs-ui-template](https://github.com/fuma-nama/fumadocs-ui-template)
- 類型：Fumadocs UI 範例模板
- 最適合參考：
  - Docs landing page
  - docs tree + home bridge
- 對本專案的價值：
  - 很適合看「首頁與文件區如何銜接」。

## F. 回饋 / 提示 / 操作狀態

### 13. emilkowalski/sonner
- Repo: [https://github.com/emilkowalski/sonner](https://github.com/emilkowalski/sonner)
- 類型：Toast feedback
- 最適合參考：
  - 投稿成功提示
  - 複製連結成功
  - 送審中 / 失敗狀態提示
- 對本專案的價值：
  - 目前專案已裝 Sonner，後續可以補足更多即時回饋，而不只是狀態文字。

## G. 對本專案最值得優先保留的雙端參考

若只留最直接有用的一批，建議優先保留：

1. [emilkowalski/vaul](https://github.com/emilkowalski/vaul)
2. [davidjerleke/embla-carousel](https://github.com/davidjerleke/embla-carousel)
3. [shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy)
4. [haydenbleasel/kibo](https://github.com/haydenbleasel/kibo)
5. [bvaughn/react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)
6. [ueberdosis/tiptap](https://github.com/ueberdosis/tiptap)
7. [fuma-nama/fumadocs](https://github.com/fuma-nama/fumadocs)
8. [emilkowalski/sonner](https://github.com/emilkowalski/sonner)

## 最後提醒

這份 responsive 武器庫的作用是：
- 讓我們之後談桌機 / 手機優化時，不再靠臨時亂找
- 提高提案品質
- 更容易區分哪些適合首頁、哪些適合工作檯、哪些適合知識頁

它不是：
- 要你現在馬上安裝一堆套件
- 要把現有站點重做成其他產品

