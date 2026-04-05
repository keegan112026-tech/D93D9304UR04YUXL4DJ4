# GitHub UI / 開源參考武器庫

建立日期：2026-04-05  
用途：為後續首頁、還原筆記、論壇、導覽、工作檯等優化提供可靠參考來源。  
性質：**Reference only**。這份文件只做蒐集與判讀，不代表已採用，也不代表要整包導入。  

## 使用原則

1. 先看是否只是借用互動或排版思路，不要預設安裝。
2. 優先參考已與本專案技術棧相近的來源：
   - Next.js App Router
   - React
   - Tailwind
   - Radix / shadcn/ui
   - Tiptap
3. 若要實際導入，必須另外做：
   - 相容性判讀
   - 視覺語言對齊
   - 資料流風險評估
4. 這份文件不作為正式規格文件，只作武器庫與靈感來源。

## A. 公共頁面外殼與資訊架構

### 1. shadcn-ui/ui
- Repo: [https://github.com/shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- 類型：元件基底庫
- 適用位置：
  - 全站導覽列
  - Sheet / Drawer / Dialog / Dropdown
  - Skeleton / Tooltip / Badge / Tabs
- 為何適合：
  - 本專案已部分使用 shadcn/ui，延伸成本低。
  - 適合拿來補齊「公共頁面外殼一致性」。
- 注意：
  - 不要整包照搬視覺，應只取結構與交互。

### 2. radix-ui/primitives
- Repo: [https://github.com/radix-ui/primitives](https://github.com/radix-ui/primitives)
- 類型：底層可及性互動 primitive
- 適用位置：
  - 手機漢堡選單
  - Popover / Menu / Dialog / Tabs
  - 焦點管理與鍵盤操作
- 為何適合：
  - 本專案已經透過 shadcn 間接使用 Radix。
  - 若未來要做更細緻的手機導覽或 overlay，可直接回源頭看行為模式。
- 注意：
  - 除非 shadcn 元件不夠，否則優先沿用既有 shadcn 包裝。

### 3. shadcn-ui/taxonomy
- Repo: [https://github.com/shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy)
- 類型：Next.js 內容型應用範例
- 適用位置：
  - 首頁資訊分層
  - 文章頁與知識頁的殼層節奏
  - Metadata / App Router 架構參考
- 為何適合：
  - 很適合參考「內容型站點怎麼保持層次感」。
  - 對首頁與 `/forum/[id]` 的閱讀節奏特別有參考價值。
- 注意：
  - 不建議整包導入；只看版面節奏與架構組織。

## B. 知識頁 / 規範頁 / 文件式閱讀體驗

### 4. fuma-nama/fumadocs
- Repo: [https://github.com/fuma-nama/fumadocs](https://github.com/fuma-nama/fumadocs)
- 類型：文件網站框架
- 適用位置：
  - `/guide`
  - `/knowledge`
  - 後續若要做更清楚的章節導覽或文件樹
- 為何適合：
  - 本專案有明顯的「知識頁 / 規範頁」需求。
  - 其文件導覽、頁內結構與閱讀節奏非常值得借鏡。
- 注意：
  - 目前建議先作為結構參考，不要直接重構整站成 docs framework。

### 5. fuma-nama/fumadocs-notion
- Repo: [https://github.com/fuma-nama/fumadocs-notion](https://github.com/fuma-nama/fumadocs-notion)
- 類型：Fumadocs + Notion 範例
- 適用位置：
  - 若未來想把部分知識頁或規範頁接更穩的 Notion 文件流
- 為何適合：
  - 本專案本來就有 Notion 後端脈絡，這個案例對「Notion 作為文件來源」很有參考價值。
- 注意：
  - 僅供未來資料架構選項評估，不是現在要換掉現有內容系統。

### 6. outline/outline
- Repo: [https://github.com/outline/outline](https://github.com/outline/outline)
- 類型：知識庫產品
- 適用位置：
  - 知識頁導覽
  - 閱讀頁層級
  - 搜尋 / 文件整理的產品方向參考
- 為何適合：
  - 如果未來你想把知識層做得更像真正的專業知識庫，Outline 很有產品層面的參考價值。
- 注意：
  - 這是大型產品，不適合直接導入；只看產品模式與導航節奏。

## C. 首頁微互動 / 視覺增色 / 區塊質感

### 7. magicuidesign/magicui
- Repo: [https://github.com/magicuidesign/magicui](https://github.com/magicuidesign/magicui)
- 類型：動畫與視覺組件庫
- 適用位置：
  - 首頁 Hero 補強
  - Skeleton / shimmer / marquee / card motion
  - 某些「安全增色」效果
- 為何適合：
  - 本專案正在追求「不廉價、但有質感」的 UI 微動態。
  - Magic UI 很適合拿來參考動態節奏與區塊呈現。
- 注意：
  - 只能挑少數效果，避免首頁失去專業感。

### 8. magicuidesign/blog-template
- Repo: [https://github.com/magicuidesign/blog-template](https://github.com/magicuidesign/blog-template)
- 類型：內容型首頁 / 文章站模板
- 適用位置：
  - `/forum`
  - `/forum/[id]`
  - 首頁文章入口卡
- 為何適合：
  - 對「文章卡片怎麼排才不俗」很有參考價值。
- 注意：
  - 參考閱讀節奏與卡片層級即可，不要把整體品牌語氣帶偏。

### 9. bytefer/awesome-shadcn-ui
- Repo: [https://github.com/bytefer/awesome-shadcn-ui](https://github.com/bytefer/awesome-shadcn-ui)
- 類型：資源總表
- 適用位置：
  - 後續想找特定 block、dashboard、marketing、card、mobile UI 時
- 為何適合：
  - 適合作為二級索引，不是直接採用對象。
- 注意：
  - 這是目錄，不是單一解法。

## D. 工作檯 / 編輯器 / 引用互動

### 10. ueberdosis/tiptap
- Repo: [https://github.com/ueberdosis/tiptap](https://github.com/ueberdosis/tiptap)
- 類型：編輯器基礎框架
- 適用位置：
  - `/sessions/[id]` 工作檯
  - 引用 chip
  - hover preview
  - slash menu / bubble menu / mobile editor 行為
- 為何適合：
  - 本專案已經在用 Tiptap。
  - 後續若要優化工作檯，不用亂找，直接回官方 repo 和 examples 最穩。
- 注意：
  - 只看單機編輯 UX。協作功能目前不要自行往 Yjs 擴張。

### 11. bvaughn/react-resizable-panels
- Repo: [https://github.com/bvaughn/react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)
- 類型：分欄工作區
- 適用位置：
  - `/sessions/[id]` 桌面雙欄工作檯
  - 多面板切換邏輯
- 為何適合：
  - 本專案已在用這套。
  - 後續若要優化桌面 / 手機切換策略，應先回官方 patterns。
- 注意：
  - 手機不應硬維持雙欄，應參考其 responsive 限縮方式，而不是強行 resizable。

### 12. TheEdoRan/next-safe-action
- Repo: [https://github.com/TheEdoRan/next-safe-action](https://github.com/TheEdoRan/next-safe-action)
- 類型：Next.js Server Actions 安全封裝
- 適用位置：
  - 投稿
  - 聯絡表單
  - 審核流程
  - 需要型別驗證與 action middleware 的位置
- 為何適合：
  - 本專案已有 `zod`，未來若 API route 想往 action 流程收斂，這是很好的候選。
- 注意：
  - 先當未來架構升級參考，不是現在要立刻全面改寫。

## E. 時間軸 / 審理程序 / 敘事式案件脈絡

### 13. prabhuignoto/react-chrono
- Repo: [https://github.com/prabhuignoto/react-chrono](https://github.com/prabhuignoto/react-chrono)
- 類型：現代 timeline 元件
- 適用位置：
  - `/sessions` 的審理程序時間軸
  - 案件演進敘事頁
- 為何適合：
  - 支援 vertical / horizontal 等多模式，對「程序進展」特別有啟發。
- 注意：
  - 不一定要安裝；它更像是 timeline 節奏和密度的參考。

### 14. stephane-monnot/react-vertical-timeline-component
- Repo: [https://github.com/stephane-monnot/react-vertical-timeline](https://github.com/stephane-monnot/react-vertical-timeline)
- 類型：垂直時間軸
- 適用位置：
  - 程序庭 / 審理庭的時間線視覺化
- 為何適合：
  - 如果未來想把目前的 hearing cards 做成更清楚的縱向脈絡，這是可參考案例。
- 注意：
  - 先看資訊層級與行動裝置呈現，不一定要直接用套件。

## F. 後端 / 編輯後台的長期替代方向

### 15. payloadcms/payload
- Repo: [https://github.com/payloadcms/payload](https://github.com/payloadcms/payload)
- 類型：Next.js 原生全端 CMS
- 適用位置：
  - 未來若 Notion 後端限制太多，這是替代方案候選
- 為何適合：
  - 強型別、版本化、後台能力完整。
- 注意：
  - 這是中長期產品決策，不是現在要動的事情。

## 對本專案最值得優先保留的參考清單

若只留最精華的一批，建議優先保留這 8 個：

1. [shadcn-ui/ui](https://github.com/shadcn-ui/ui)
2. [radix-ui/primitives](https://github.com/radix-ui/primitives)
3. [shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy)
4. [fuma-nama/fumadocs](https://github.com/fuma-nama/fumadocs)
5. [magicuidesign/magicui](https://github.com/magicuidesign/magicui)
6. [ueberdosis/tiptap](https://github.com/ueberdosis/tiptap)
7. [bvaughn/react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)
8. [TheEdoRan/next-safe-action](https://github.com/TheEdoRan/next-safe-action)

## 建議未來怎麼使用這份武器庫

1. 首頁要優化時：
   - 先看 `taxonomy`
   - 再看 `magicui`
2. `/guide` 或 `/knowledge` 要重構時：
   - 先看 `fumadocs`
   - 再看 `outline`
3. `/sessions/[id]` 工作檯要精修時：
   - 先看 `tiptap`
   - 再看 `react-resizable-panels`
4. 時間軸與案件總覽要更清楚時：
   - 先看 `react-chrono`
   - 再看 `react-vertical-timeline`
5. 表單 / 投稿 / action 安全化時：
   - 先看 `next-safe-action`

## 最後提醒

這份文件的角色是：
- 幫我們擴充參考來源
- 提高之後提案品質
- 降低「臨時亂找範例」的成本

它的角色不是：
- 直接指定重構方向
- 暗示整包導入
- 取代現有產品判斷

