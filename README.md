# 🔔 TaskChime - Simple & Fast Daily Task Manager

A fast, responsive, and distraction-free daily task management web application built with vanilla JavaScript, semantic HTML5, and modern CSS.

TaskChime allows you to organize your daily schedule, prioritize activities, receive browser notifications/alarms, and share your tasks directly via WhatsApp — all while saving your data locally in your browser.

🌐 **Live Demo:** [https://taskchime.vercel.app/](https://taskchime.vercel.app/)

---

## 🚀 About The Project

**TaskChime** is my **first JavaScript project**! The goal was to build a complete, real-world productivity tool from scratch without relying on external libraries or frameworks. It focuses on clean DOM manipulation, asynchronous browser APIs, responsive dark-mode UI design, and web accessibility.

---

## ✨ Features

- 📝 **Full CRUD Functionality**: Create, Read, Update, and Delete tasks seamlessly.
- 🎨 **Priority Levels**: Categorize tasks into **High**, **Medium**, and **Low** with distinct color-coded badges.
- 🔍 **Real-Time Search**: Instant task filtering as you type into the search bar.
- 🏷️ **Category Filter**: Filter tasks on the fly by priority or view all tasks together.
- 💾 **Local Storage Persistence**: Your tasks stay saved across browser refreshes and sessions.
- ⏰ **Browser Notifications & Alarms**: Request desktop notification permissions and get timely reminders for pending tasks.
- 📲 **One-Click WhatsApp Sharing**: Share pre-formatted task details directly to WhatsApp contacts.
- 🛡️ **Custom Confirmation Modal**: A sleek, custom-designed confirmation dialog replaces the default browser `confirm()` popup.
- 📱 **Mobile-First & Responsive**: Built with CSS Flexbox, Grid, and Media Queries to adapt smoothly across desktop, tablet, and mobile screens.
- 🚀 **SEO Optimized**: Includes meta tags, Open Graph cards, Twitter cards, JSON-LD structured data, `sitemap.xml`, and `robots.txt`.

---

## 🛠️ Built With

- **HTML5** – Semantic document layout, input controls, and SEO metadata.
- **CSS3** – Dark mode aesthetics, CSS custom properties, responsive layouts, hover animations, and custom modal styling.
- **Vanilla JavaScript (ES6+)** – DOM manipulation, event delegation, `localStorage` API, Web Notifications API, and asynchronous handling.
- **Hosting** – Deployed on [Vercel](https://vercel.com/).

---

## 📂 Project Structure

```text
TaskChime/
├── assets/
│   ├── AnimatedLogo.gif
│   ├── Logo.png
│   ├── WhatsappLogo.svg
│   └── WhatsappBlackLogo.svg
├── index.html        # Main application markup & SEO structure
├── style.css         # Styling, dark theme, animations & responsive media queries
├── script.js         # Core application logic, state, and browser APIs
├── robots.txt        # Search engine crawler instructions
├── sitemap.xml       # Search engine site index
└── README.md         # Project documentation
```

---

## 💻 Getting Started Locally

To run this project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AliMustafa43/Todo.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd TaskChime
   ```
3. **Open in your browser:**
   - Double-click `index.html` to open it in your default browser, or
   - Use a local development server like VS Code's **Live Server** extension for the best experience (especially for Web Notifications and PWA testing).

---

## 🧠 What I Learned

Building TaskChime as my first JavaScript project taught me foundational web development skills:

1. **Event Delegation**: Handling clicks for dynamically generated list items using a single parent event listener (`container.addEventListener("click", ...)`).
2. **State & Synchronization**: Synchronizing in-memory JavaScript arrays (`storage`) with both `localStorage` and the DOM.
3. **DOM Manipulation**: Dynamically constructing cards using template literals and managing modal overlays.
4. **Browser APIs**: Working with the `Notification` API and handling permissions asynchronously.
5. **Modern Layouts**: Crafting clean user interfaces with Flexbox, CSS Grid, and media queries.

---

## 📄 License

This project is open-source and free to use under the [MIT License](LICENSE).

