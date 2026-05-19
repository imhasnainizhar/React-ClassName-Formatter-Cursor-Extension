<div align="center">

<br />

# ClassName Template Literal

### The VS Code extension that keeps your Tailwind CSS workflow *clean, fast, and beautifully formatted.*

<br />

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Ready-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-JSX%2FTSX-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

<br />

</div>

---

## 🎨 What Is This?

**ClassName Template Literal** forces `className` attributes to use template literals — `` className={`...`} `` — instead of static strings. It also ships a powerful formatter that beautifully wraps and aligns long lists of Tailwind classes, so your JSX stays readable no matter how many utilities you stack.

Built for React + Tailwind CSS developers who care about consistency and clean code.

---

## ✨ Features

### ⚡ Turbo-Charged Autocomplete
Type `cl` or `className` and instantly get `` className={` `} `` at the **very top** of your IntelliSense list — no scrolling, no hunting.

### 🛡️ Smart Auto-Correction
Accepted a default `className=""` by accident? Used an Emmet abbreviation? The extension catches it **on the fly** and converts it to backtick template literals instantly.

### 📐 Multi-Line Formatter
Got a 150-character Tailwind string destroying your horizontal scroll? The formatter handles it automatically:

| Behavior | Detail |
|---|---|
| **Word-wraps** long strings | Breaks at ~70 characters |
| **Smart indentation** | Indents exactly 1 tab from your HTML tag |
| **Aligned closing tag** | `}>` lines up perfectly with the opening tag |
| **Preserves dynamic logic** | Leaves `${isActive}` and JS expressions untouched |

---

## 🚀 Usage

### 1 — Autocomplete & Auto-Correction

Just start typing inside your JSX/TSX tags:

```jsx
// Type this:
<div cl

// Press Enter → instantly expands to:
<div className={`|`}
//                ^ cursor lands here, ready to type
```

The interceptor also silently fixes any of these patterns the moment they appear:

```jsx
// Emmet output or default completion...
<div className="">         →   <div className={``}>
<div className=''>         →   <div className={``}>
```

---

### 2 — The Formatter

**Before** — a long, unreadable Tailwind string:

```jsx
<div className="p-4 m-4 bg-black text-text-secondary text-shadow-text-primary text-[clamp(30px,2vw,16px)] flex flex-col justify-center items-center">
```

**Trigger the formatter** — right-click anywhere in the file and choose:

> **Format className to `` {`} ``**

Or click the **`` className→{`} ``** button in the status bar at the bottom of your editor.

**After** — clean, perfectly indented template literal:

```jsx
<div className={`
    p-4 m-4 bg-black text-text-secondary text-shadow-text-primary
    text-[clamp(30px,2vw,16px)] flex flex-col justify-center items-center
`}>
```

> **💡 Tip:** Dynamic expressions like `${isActive ? 'opacity-100' : 'opacity-0'}` are detected and left exactly as-is. The formatter never touches your logic.

---

## ⚙️ Supported Languages

The extension activates automatically for all React-compatible file types:

| Language | Extension |
|---|---|
| JavaScript | `.js` |
| JavaScript React | `.jsx` |
| TypeScript | `.ts` |
| TypeScript React | `.tsx` |

---

## 📦 Installation

1. Open **VS Code**
2. Go to **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **`ClassName Template Literal`**
4. Click **Install**

Or install from the command line:

```sh
code --install-extension classname-template-literal
```

---

## 🛠️ Commands

| Command | Trigger |
|---|---|
| Format className in current file | Right-click → **Format className to `` {`} ``** |
| Format className in current file | Status bar button **`` className→{`} ``** |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

Made with ❤️ for React & Tailwind CSS developers