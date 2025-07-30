# 🧩 Microfrontend Monorepo with Vite, TanStack Router, and Module Federation

## Structure

```
monorepo/
├── shell/          # Host app with layout & routing
├── shop/           # Remote microfrontend exposing routes
├── kong-shell/     # Kong config for layout-controlled routing
└── kong-remote/    # Kong config for standalone remote access
```

## 🛠️ Getting Started

1. **Install dependencies**

```bash
cd shop && npm install
cd ../shell && npm install
```

2. **Run dev servers**

```bash
# In one terminal
cd shop && npm run dev

# In another terminal
cd shell && npm run dev
```

3. **Run Kong Gateway**

Choose one:

- Shell layout only:
  ```bash
  cd kong-shell && docker-compose up
  ```

- Shell + standalone remote:
  ```bash
  cd kong-remote && docker-compose up
  ```

4. **Access your app**

- Shell layout: http://localhost:8000/
- Shop product: http://localhost:8000/shop/name-xyz

## ✅ Features

- Shared layout with always-visible NavBar
- Remote subroutes via Module Federation
- Two Kong setups for flexible architecture
