# TaskChime

A simple task manager web app built with vanilla JavaScript, HTML, and CSS. It helps you track daily tasks, set priority levels, and receive browser notifications for scheduled reminders.

Live demo: [https://taskchime.vercel.app/](https://taskchime.vercel.app/)

## About

TaskChime is my first JavaScript project. I built it to practice core front-end fundamentals—mainly DOM manipulation, event delegation, working with `localStorage`, and using browser APIs like Notifications—without relying on any external libraries or frameworks.

## Features

- Add, edit, complete, and delete tasks
- Priority tags: High, Medium, Low
- Filter tasks by priority or search by keyword
- Browser notifications for scheduled tasks (via Web Notifications API)
- Share a task directly through WhatsApp
- Data saved in `localStorage` so tasks remain after refreshing
- Custom confirmation modal before deleting a task
- Responsive layout for mobile and desktop

## Built With

- HTML5
- CSS3
- Vanilla JavaScript
- Hosted on Vercel

## Project Structure

```text
TaskChime/
├── assets/
│   ├── AnimatedLogo.gif
│   ├── Logo.png
│   ├── WhatsappLogo.svg
│   └── WhatsappBlackLogo.svg
├── index.html
├── style.css
├── script.js
├── robots.txt
├── sitemap.xml
└── README.md
```

## Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/AliMustafa43/Todo.git
   ```
2. Open `index.html` directly in your browser, or use a local development server like VS Code Live Server.
