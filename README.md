# 🚀 Privanode by Veltrian
> **Your data. Your node. Your control.**

A **privacy-first storage platform** — no cloud, no server, no data leaks.
Currently building the **first user-driven version** with insights from **18+ real users** and a growing open-source community.

<br/>
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png"/>
<br/>

<div align="center">
  <table align="center">
    <thead align="center">
      <tr>
        <td><b>🌟 Stars</b></td>
        <td><b>🍴 Forks</b></td>
        <td><b>🐛 Issues</b></td>
        <td><b>🔔 Open PRs</b></td>
        <td><b>🔕 Closed PRs</b></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><img alt="Stars" src="https://img.shields.io/github/stars/salonijoshi1980/Veltrian?style=flat&logo=github" /></td>
        <td><img alt="Forks" src="https://img.shields.io/github/forks/salonijoshi1980/Veltrian?style=flat&logo=github" /></td>
        <td><img alt="Issues" src="https://img.shields.io/github/issues/salonijoshi1980/Veltrian?style=flat&logo=github" /></td>
        <td><img alt="Open PRs" src="https://img.shields.io/github/issues-pr/salonijoshi1980/Veltrian?style=flat&logo=github" /></td>
        <td><img alt="Closed PRs" src="https://img.shields.io/github/issues-pr-closed/salonijoshi1980/Veltrian?style=flat&color=critical&logo=github" /></td>
      </tr>
    </tbody>
  </table>


  <!-- Tech stack badges -->
  ![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-6-yellow?style=for-the-badge&logo=vite)
  ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38b2ac?style=for-the-badge&logo=tailwindcss)
  ![ChakraUI](https://img.shields.io/badge/ChakraUI-v2-63B3ED?style=for-the-badge&logo=chakraui)
  ![Clerk](https://img.shields.io/badge/Clerk-auth-green?style=for-the-badge&logo=clerk)
  ![Open Source](https://img.shields.io/badge/Open%20Source-blueviolet?style=for-the-badge&logo=github)

</div>


## 📑 Table of Contents
1. [🧠 What We’re Solving](#-what-were-solving)
2. [🧩 Current Progress](#-current-progress)
3. [⚙️ Tech Stack](#️-tech-stack)
4. [💡 How You Can Contribute](#-how-you-can-contribute)
5. [📊 Community Validation](#-community-validation)
6. [❤️ Contributors](#-contributors)
7. [🔍 FAQ](#-faq)
8. [📬 Connect](#-connect)
9. [🌈 License](#-license)

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png"/>

## 🧠 What We’re Solving

Most storage platforms depend on **cloud or centralized servers** —
causing **data leaks, storage limits, complex setups** (credit cards, tokens, API keys, etc.).
**Privanode** eliminates that by enabling **peer-based local storage**,
where users can store, visualize, and control their own data securely and independently.

---

## 🧩 Current Progress

- 🧑‍💻 Built **first MVP (core feature live)**
- 📊 **20+ user survey responses** in just 2 days
- 💬 Refining setup flow & UI based on real feedback
- 🧑‍🎓 Balancing **college exams** and **product development**
- 🌍 Built with help from **open-source contributors**

---

## ⚙️ Tech Stack

| Category                    | Technology                         |
|----------------------------:|------------------------------------|
| **Frontend Framework**      | React 18 + Vite v6                 |
| **Routing**                 | React Router v7                    |
| **Styling**                 | Tailwind CSS v3 + Chakra UI        |
| **State Management**        | Zustand                            |
| **Data Fetching**           | TanStack Query (React Query)       |
| **Authentication**          | Clerk                              |
| **Charts & Visualization**  | Recharts                           |
| **Icons**                   | Lucide React                       |
| **Testing**                 | Vitest (Unit) + Cypress (E2E)      |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version **18** or higher)  
- npm (comes bundled with Node.js)  
- A Clerk account (for authentication) — optional for local UI dev, required for auth flows

### Clone & Install
```bash
# Clone the repository
git clone https://github.com/salonijoshi1980/Veltrian.git

# Go into the project
cd Veltrian

# Install all dependencies
npm install

# If you prefer yarn optional not need to run this if u use npm:
yarn

# Install React Router
npm install react-router

# Environment variables : Create a local .env from the example and fill in Clerk keys and other secrets
cp .env.example .env

# Example .env (update values with your own keys):
VITE_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
VITE_CLERK_AFTER_SIGN_IN_URL=/app
VITE_CLERK_AFTER_SIGN_UP_URL=/app
VITE_CLERK_SIGN_IN_URL=/login
VITE_CLERK_SIGN_UP_URL=/signup

# Other environment variables (examples)
VITE_API_BASE_URL=http://localhost:4000/api
NODE_ENV=development

Important: Do not commit real secrets — add .env to .gitignore (should already be present).

# Start the dev server:
npm run dev

# By default the app runs at:
http://localhost:4000 (if 4000 is busy Vite will choose another port — check your terminal)

# Build for production:
npm run build

# Run TypeScript type checks:
npm run typecheck
```

## 📂 Project Structure

```bash
src/
├── app/                   # App router & pages (editable)
│   ├── api/               # API routes (editable)
│   ├── app/               # Main application pages (app/page.jsx)
│   │   └── page.jsx
│   ├── components/        # Reusable UI components
│   │   ├── FileManager/   # File manager components
│   │   │   ├── FileList.jsx
│   │   │   ├── UploadArea.jsx
│   │   │   ├── PreviewModal.jsx
│   │   │   ├── PassphraseSetupModal.jsx
│   │   │   └── index.js
│   │   ├── Header.jsx
│   │   └── README.md
│   ├── hooks/             # Custom hooks
│   │   ├── useFileOperations.js
│   │   ├── useFormatting.js
│   │   └── README.md
│   ├── login/             # Login page & auth components
│   ├── __create/          # Auto-generated files (do not edit)
│   ├── layout.jsx
│   └── routes.ts
├── utils/                 # Utility functions (editable)
├── assets/                # Images, videos (e.g., demo.mp4)
└── ...                    # Other auto-generated or config files

# ⚠️ Auto-generated: Do not edit
# - src/app/__create/
# - src/__create/
# - src/auth.d.ts
# - src/client.d.ts
# - src/global.d.ts
# - build/
# - node_modules/

```
## 🧑‍💻 Editable Areas for Frontend Contributors

If you're contributing to the **frontend**, you can safely edit the following files and folders:

```bash
src/app/             # Main application folder (except __create/)
src/utils/           # Utility functions and helpers
src/app/components/  # Reusable UI components
src/app/hooks/       # Custom React hooks
src/assets/          # Images, videos (e.g., demo.mp4)
src/app/layout.jsx   # Root layout component
src/app/routes.ts    # Route configuration

Important:

Do not modify backend logic or auto-generated files — especially those located in:
src/app/__create/
src/app/api/
Authentication setup files (auth.d.ts, Clerk configs, etc.)
These areas are directly connected to the integrated backend, which handles login and email functionality.

Any backend-related changes should be discussed with the maintainer before making edits.

```

## 💡 How You Can Contribute

If you love privacy, open source, and problem-solving, help shape Privanode into the next evolution of local-first computing:

- Fork this repository
- Check open issues → (UI, file structure, docs, templates)
- Comment on an issue you’d like to work on
- Create a PR with your improvement

Every contribution counts 💙

You can check current issues like:
- Adding `CODE_OF_CONDUCT.md`
- Creating PR Templates
- Enhancing UI and documentation

## 🤝 Contributing

We welcome contributions from the community!  
Please read our [Contribution Guidelines.md](./CONTRIBUTING.md) for detailed guidelines on how to create issues, submit pull requests, and maintain code quality.

If you find issues or want to add features, check existing issues or open new ones. Every contribution counts! 💙

---

## 📊 Community Validation

💬 Within 48 hours of survey launch:
- 20+ users responded
- Top concerns: limited storage, complex setups, and credit-card-based systems
- Many showed interest in peer or node-based storage models

### 🖼️ Survey & Response Charts

<img width="865" height="359" alt="Screenshot 2025-11-02 201411" src="https://github.com/user-attachments/assets/3c070328-3310-48db-a293-95818eda4e48" />
<img width="864" height="353" alt="Screenshot 2025-11-02 201423" src="https://github.com/user-attachments/assets/51f54d3c-e43a-4e74-b16a-5c60326642d7" />
<img width="862" height="580" alt="Screenshot 2025-11-02 201435" src="https://github.com/user-attachments/assets/5f9e99df-915f-493b-9072-2442095f0f40" />
<img width="862" height="385" alt="Screenshot 2025-11-02 201445" src="https://github.com/user-attachments/assets/10c16890-565b-4c52-8530-342ad60f80b7" />
<img width="863" height="386" alt="Screenshot 2025-11-02 201452" src="https://github.com/user-attachments/assets/c0ea398d-23e7-45ec-9909-816cd50b4950" />


> *Replace these with your real chart screenshots for the survey.*

---

## ❤️ Contributors  

Thanks to everyone helping build **Veltrian**! 🎉  
Your support, ideas, and contributions make this project grow stronger every day. 💪  

<p align="center">
  <a href="https://github.com/salonijoshi1980/Veltrian/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=salonijoshi1980/Veltrian" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/salonijoshi1980/Veltrian">
    <img src="https://img.shields.io/github/contributors/salonijoshi1980/Veltrian?color=blue&label=Contributors&logo=github" />
  </a>
</p>

<p align="center">
  💖 <b>Want to be featured here?</b>  
  <br />
  Contribute to the project by opening issues, fixing bugs, or submitting PRs!
</p>

#### A Big Thank You to Our Contributors! 🎉👏

We’re grateful to our amazing contributors for helping make Privanode a success!

---

## 🔍 FAQ

<details>
<summary>How is Privanode different from cloud storage platforms?</summary>

Privanode operates on a **local-first, peer-driven architecture** so your data never leaves your control unless you want it to. No cloud, no third-party APIs, no centralized leaks.
</details>

<details>
<summary>Do I need a credit card or external identity for setup?</summary>

No! Privanode avoids credit-card-based systems and external tokens entirely. Onboarding is simple and private.
</details>

<details>
<summary>How do I contribute?</summary>

Just pick an issue, fork the repo, and send a PR. See [How You Can Contribute](#-how-you-can-contribute) for steps!
</details>

<details>
<summary>What survey feedback influenced the project direction?</summary>

Our **first 18+ users** highlighted pain points in cloud systems, setup complexity, and data privacy, leading to peer/node-based storage as our core solution. See charts above!
</details>

<details>
<summary>Where can I find documentation?</summary>

Check the `/docs/` folder, README badges, and open GitHub issues for everything from setup to API usage.
</details>

---

## 📬 Connect

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/salonijoshi2006)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/salonijoshi1980)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:your@email.com)

---

## 🌈 License

MIT License © 2025 Veltrian
