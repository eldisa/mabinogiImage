# Mabinogi Skill Images Repository

這個儲存庫用於存放《瑪奇 Mabinogi》的技能圖示與相關美術資源，提供給網頁專案或數據分析工具透過 CDN 直接讀取。

## 🚀 快速使用 (CDN)

為了獲得最佳的載入速度，建議使用 **jsDelivr CDN** 進行存取。

### 技能圖示 (Skill Icons)
路徑格式：
`https://cdn.jsdelivr.net/gh/eldisa/mabinogiImage@main/SkillImage/{SkillID}.png`

**範例：**
- 技能 ID `10001`：
  [https://cdn.jsdelivr.net/gh/eldisa/mabinogiImage@main/SkillImage/10001.png](https://cdn.jsdelivr.net/gh/eldisa/mabinogiImage@main/SkillImage/10001.png)

---

## 📂 資料夾結構

| 資料夾名稱 | 內容說明 | 檔案格式 |
| :--- | :--- | :--- |
| `SkillImage/` | 遊戲技能圖示，檔名對應 `SkillID` | `.png` (建議 32x32 或 64x64) |
| `ItemImage/`  | 道具圖示 (預留) | `.png` |

---

## 🛠 上傳規範

為了確保程式能自動抓取資源，請遵守以下規則：

1. **檔案格式**：統一使用 `.png` 格式（透明背景）。
2. **命名規則**：
   - 技能圖片請直接使用官方 `SkillID` 命名（例如：`59120.png`）。
   - 請避免使用中文檔名，以免 URL 編碼造成讀取錯誤。
3. **路徑大小寫**：GitHub 與 CDN 分辨大小寫，請確保資料夾名稱為 `SkillImage`。

---

## 💻 程式介接範例 (Vue/TS)

如果你要在 Vue 專案中使用，可以參考以下寫法：

```typescript
const getSkillIcon = (id: number | string) => {
  const baseUrl = "[https://cdn.jsdelivr.net/gh/eldisa/mabinogiImage@main/SkillImage/](https://cdn.jsdelivr.net/gh/eldisa/mabinogiImage@main/SkillImage/)";
  return `${baseUrl}${id}.png`;
};
