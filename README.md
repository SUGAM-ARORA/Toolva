<div align="center">

# 🚀 Toolva.ai — Next-Gen AI Tools Directory & Workflow Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Styling-Custom%20CSS-38BDF8)](https://tailwindcss.com)

**Discover, compare, and build workflows with 600+ curated AI tools.**  
*Fast, community-driven, dark-first UI with live 10-role security management.*

[🌐 Live Directory](http://localhost:4185) · [📬 Official Support](mailto:support.toolva@gmail.com) · [💡 Submit an AI Tool](#-how-to-submit-an-ai-tool)

</div>

---

## ✨ Unique Features

| Feature | Highlight Description |
|---|---|
| 🧠 **600+ Curated AI Tools** | Deep directory covering Code Assistants, Image Gen, LLMs, Audio, Video, & Productivity |
| 🛡️ **10-Role Security System** | Tiered hierarchy (`Novice` → `Master` → `SuperAdmin`) with profile self-elevation lockout |
| ⚡ **Claude & Model Breakdowns** | In-depth engineering guides (Why, When, How, Where, Which model to use) |
| 📊 **Multi-View Layouts** | Seamless Grid View, List View, and Table Comparison View toggling |
| 🎨 **Workflow Builder Canvas** | Interactive drag-and-drop workflow sequence builder |
| 👑 **SuperAdmin Control Centre** | Live submission verification queue (`/admin`) and Activity Logs tracker (`/activity`) |
| 📧 **Unified Support Hub** | Direct assistance at `support.toolva@gmail.com` |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### Installation & Local Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SUGAM-ARORA/Toolva.git
   cd Toolva
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## 📤 How to Submit an AI Tool

We welcome new tool submissions from developers and creators! You can submit an AI tool using either of the two techniques below:

### Technique 1: GUI Interactive Submission (Recommended)
1. Launch Toolva and click the **Submit Tool** (`+`) button in the main navigation bar.
2. Complete the step-by-step form:
   - **Tool Name** & **Category** (e.g. Code, Design, Productivity)
   - **Description** & **Website URL**
   - **Pricing Model** (Free, Freemium, Paid)
   - **Tech Stack** & **API details** (optional)
3. Click **Submit Tool**. Your submission will be routed directly to the **Toolva Control Centre** (`/admin`) where a SuperAdmin reviews and approves it for live indexing.

### Technique 2: Open-Source Git Commit Submission
Developers can contribute tools directly via code contribution:

1. Fork the repo and open `src/data/unifiedTools.ts`.
2. Add your tool definition following the schema:
   ```typescript
   {
     id: 'my-ai-tool',
     name: 'My AI Tool Name',
     description: 'A brief 1-2 sentence description of what the AI tool does.',
     category: 'Code',
     url: 'https://mytool.ai',
     pricing: 'Freemium',
     rating: 4.9,
     featured: true,
     easeOfUse: 4.8,
     lastUpdated: new Date().toISOString()
   }
   ```
3. Commit your changes using standard convention:
   ```bash
   git commit -m "feat(tools): add My AI Tool to directory"
   ```
4. Open a Pull Request for SuperAdmin review.

---

## 🤝 Commit & Contribution Guidelines

To keep the repository clean and maintainable, please follow our structured commit conventions:

- `feat(tools):` Adding or updating AI tool definitions
- `feat(ui):` Adding new UI components or directory views
- `fix(auth):` Security fixes or 10-role permission updates
- `docs:` Documentation and README updates

---

## 📬 Official Support & Contact

If you have questions regarding tool listings, account roles, or partnership inquiries, reach out to our official support team:

- **Support Email**: [support.toolva@gmail.com](mailto:support.toolva@gmail.com)
- **Unified Support Hub**: Visit `/contact` in the application
- **Help FAQ & Knowledge Base**: Visit `/help` in the application

---

<div align="center">

Made with ❤️ by **Sugam Arora** & the Toolva Open Source Community.

</div>
