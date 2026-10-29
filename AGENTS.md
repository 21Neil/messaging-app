# 專案協作規範

適用於整個專案。實作前先閱讀相關檔案與相鄰功能，沿用既有架構及局部風格。使用者明確指示優先於本文件；現有程式中的疏漏、拼字錯誤與不安全寫法不視為必須延續的慣例。

## 溝通與修改範圍

- 使用繁體中文說明；程式識別字使用英文。
- 先理解問題的資料流，再修改根本原因。資訊不足時，區分已確認的事實與推測。
- 將變更限制在任務所需範圍，保留使用者正在進行的修改，不順便重新排版或重構無關檔案。
- 優先使用現有套件與工具。避免為簡單需求增加依賴、通用框架或多餘的抽象層。
- 完成後簡述修改內容、驗證結果及尚未確認的限制；未執行的檢查不得宣稱通過。

## 技術與目錄分工

本專案使用 React 19、TypeScript strict、React Router Framework Mode、Vite、Mantine 與 Zod，使用 npm 管理套件。

| 位置 | 職責 |
| --- | --- |
| `app/routes.ts` | 路由設定 |
| `app/root.tsx` | 全域文件結構、樣式與 Provider |
| `app/layouts/` | 共用路由版型、驗證與 Outlet context |
| `app/routes/<feature>/<feature>.tsx` | 頁面、路由資料載入及 action 協調 |
| `app/routes/<feature>/components/` | 功能專用元件與表單 |
| `app/components/` | 跨功能共用元件，例如 BasicModal、BasicButton |
| `app/services/services.ts` | HTTP 封裝、credentials 與共用錯誤處理 |
| `app/services/<domain>-services.ts` | 領域 API、資料型別與表單 schema |
| `app/services/common-schema.ts` | 共用驗證規則 |
| `app/utils/` | 工具函式與共用通知 |

- 功能專用元件留在該功能目錄，出現實際共用需求時再提升到共用層。
- service 不匯入頁面或 UI 元件；共用型別從適當的 service 匯入，避免循環依賴。
- 不直接修改 `node_modules/`、`build/`、`.react-router/` 等產生內容。

## Coding style

- 使用兩格縮排、單引號、分號；多行物件與參數沿用所在檔案的尾逗號格式。
- 預設使用 `const` 與箭頭函式；需要重新賦值才用 `let`，不使用 `var`。
- 元件使用 PascalCase，檔案使用 kebab-case；函式與變數使用 camelCase。
- 事件處理函式使用 `handleSubmit`、`handleClose`、`handleAccept` 等名稱；boolean 使用 `isPending`、`opened` 等可辨識狀態的名稱。
- 元件使用箭頭函式及 default export；loader、action、schema 與需共用的型別使用 named export。
- 跨目錄引用使用 `~/` alias，相鄰檔案使用相對路徑。型別使用 `import type` 或 inline `type` import。
- 簡單的單參數箭頭函式可省略括號；簡單 guard clause 可省略大括號，較長或多步驟分支使用大括號。
- 用空行區分資料解析、驗證、API 呼叫及回傳。避免巢狀三元運算式及過深的條件巢狀。
- 名稱應說明用途；短小的請求流程可沿用 `res`、`body`、`formdata`、`intent`，有多份資料時改用具體名稱。
- 註解說明必要的原因或限制，不重述程式碼；移除臨時 `console.log`、未使用的 import 與死程式碼。

## TypeScript 與資料契約

- 物件結構與 props 優先使用 `interface`；陣列別名、聯集、衍生型別使用 `type`。
- 表單值從 Zod schema 透過 `z.infer` 推導，避免重複維護驗證與型別。
- 優先沿用 `<Component>Props`、`<Action>FormValues`、`<Action>Req`、`Get<Resource>Res` 等命名。
- 讓 TypeScript 推導明確的區域變數型別；在 props、API 契約及外部資料邊界提供清楚的型別。
- 新增程式避免 `any`、非必要的型別斷言與 non-null assertion。未知資料使用 `unknown` 並縮窄型別。
- API 型別必須符合實際 JSON。直接回傳陣列就使用 `type GetFriendRequestsRes = FriendRequest[]`，不要憑空新增 `requests` 或 `data` 包裝。
- TypeScript 型別不會驗證執行期資料。依資料來源與風險，在必要邊界使用 schema 或明確檢查，不在每一層重複驗證。
- 解析 FormData 時注意值可能是 `string`、`File` 或 `null`；字串、數值與檔案分別檢查，不靠斷言隱藏問題。
- 數字轉型使用清楚的寫法，例如 `Number(...)`；依 API 契約檢查正整數等限制。缺值與空字串可能轉成 `0`，不要只檢查 `NaN`。

## 路由與資料流

- 沿用 `clientLoader` 載入瀏覽器端 API 資料，使用 `clientAction` 處理資料異動；路由參數型別從 `./+types/<route>` 匯入。
- 元件負責互動與呈現，action 負責解析、驗證及協調 service，service 負責 endpoint 與 HTTP 呼叫。
- 多種操作由 FormData 的 `intent` 搭配 `switch` 分流。修改時沿用既有 intent，新操作使用清楚且一致的名稱。
- 需要維持目前頁面的獨立操作使用 `useFetcher`；一般頁面表單可沿用 `useSubmit`。用對應的提交狀態控制 loading 與重複送出。
- action 完成後優先依靠 React Router 的 loader revalidation 更新資料，不另建重複的 fetch 或同步狀態。
- props 能提供的資料不重複存入 state；可從 loader、fetcher 或既有 state 推導的值直接計算。
- 彼此獨立的請求使用 `Promise.all`；有資料相依性的請求依序執行。
- SSR 期間不使用瀏覽器專用 API；需要 server loader 的邏輯必須能在伺服器執行。
- 修改 React Router 行為時，依專案的 `react-router` skill 與已安裝版本文件確認做法。

## API、錯誤與回饋

- HTTP 呼叫透過既有 `apiGet`、`apiPost`、`apiPatch` 等 helper，不在元件重建 fetch 封裝。
- 保留 cookie 驗證所需的 `credentials: 'include'`；上傳 FormData 時讓瀏覽器設定 multipart boundary。
- 注意目前 `customFetch` 會顯示錯誤通知並在失敗時回傳 `undefined`。新增或調整型別時如實表達失敗情況，呼叫端不可假設一定成功。
- 成功判斷必須符合 endpoint 契約；回傳空內容的成功請求不能一律用 `if (res)` 判斷。若需支援此行為，在 HTTP 層明確處理並檢查相關呼叫端。
- 共用錯誤通知由 HTTP 層處理，避免呼叫端再次顯示同一錯誤。成功通知沿用 `customNotifications.showSuccess`。
- 區分載入中、載入失敗、空列表與有資料的狀態；不要用 `[]` 掩蓋請求失敗。
- 操作失敗時保留可重試的輸入；需確認成功才能關閉的表單，在確認成功後再 reset 或關閉。
- 不把 `.env`、Cookie、Token、密碼或個資寫入程式碼、log、文件或提交內容。

## UI 與表單

- 優先使用 Mantine 元件與 style props，沿用 BasicModal、ConfirmModal 等共用元件。
- 表單沿用 `useForm`、`mode: 'uncontrolled'`、`schemaResolver`、`form.key` 與 `getInputProps`。
- Modal 開關使用 `useDisclosure`；自訂樣式優先放功能旁的 CSS Module，全域樣式只處理全站需求。
- 列表使用穩定的資料 ID 作為 key；明確設定非提交按鈕的 `type='button'`。
- 保持鍵盤操作、欄位 label 與按鈕語意；只有圖示的互動元件提供可辨識的 accessible name。
- 使用者提示沿用功能的繁體中文用語，錯誤訊息說明可理解且可處理的原因。

## 驗證與交付

- 修改前查看相關實作與 `package.json` scripts；沒有設定 lint 或 test 指令時，不虛構指令或檢查結果。
- TypeScript／React 修改執行 `npm run typecheck`；影響路由、SSR、依賴或打包時再執行 `npm run build`。
- 修復互動問題時，依變更驗證正常、空資料、失敗及處理中狀態；API 格式問題以實際回應或已確認契約為依據。
- 對高風險邏輯與值得保護的回歸案例加入適當測試；不為純文件或簡單外觀修改新增測試框架。
- 僅修改本文件時，檢查 Markdown、路徑與規則是否符合現況即可，不必執行應用程式建置。
- 若工具、權限或環境阻止驗證，清楚回報原因與尚未完成的項目。
