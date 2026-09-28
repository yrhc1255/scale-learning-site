# 尺度探索站

國中自然科「尺度」單元互動學習網站，共 11 頁，包含觀察尺度、單位選擇、比例尺、池水生物、仿生設計、形成性評量、分類遊戲、極限挑戰與學習成果。

正式網站由 GitHub Pages 提供。學生進度保存在目前瀏覽器；成績摘要會排入本機佇列並上傳至教師的 Google Apps Script 成績表。網路中斷時保留待傳資料，恢復連線或下次開啟後重送。

本專案沒有連接 Firebase。公開程式庫不包含 Google 試算表網址、試算表 ID、Google 登入權杖或 GitHub 登入權杖。

## 本機開發

```powershell
cd scale-learning-site
npm.cmd install
npm.cmd run dev -- --port 4173
npm.cmd test
npm.cmd run test:e2e
npm.cmd run build:standalone
```

最外層 `index.html` 是 GitHub Pages 與直接開啟版本；圖片位於 `scale-learning-site/public/designs/`。

## 成績同步

- 前端設定：`scale-learning-site/src/sync-config.js`
- 可靠佇列：`scale-learning-site/src/score-sync.js`
- GAS 程式：`scale-learning-site/gas/Code.gs`
- GAS 設定：`scale-learning-site/gas/appsscript.json`

成績表保存班級、座號、姓名、練習分數、形成性評量、分類遊戲、極限挑戰、完成題數與完成率。同一學生以班級、座號及姓名合併；遊戲與極限挑戰保留最高分。
