# 🎯 Dash Mag - React Dashboards Export

Complete React/Next.js dashboard composition ready for production deployment.

## 🚀 Quick Start (3 Steps)

### 1️⃣ Deploy to Server (10 minutes)
```bash
cd EXPORT_REACT_DASHBOARDS
npm install
npm run build
npm start
```

### 2️⃣ Or Use Automated Deployment Script
```bash
./START_DEPLOYMENT.sh
```

### 3️⃣ Then Setup PM2
```bash
./manage-remote-dashboard.sh setup
```

## 🌐 Access URLs (After Deployment)

- **Login**: http://10.253.100.16:3000/dashboard/login
- **Executive Dashboard**: http://10.253.100.16:3000/dashboard/executive
- **Operational v2**: http://10.253.100.16:3000/dashboard/operational-v2
- **Predictive v2**: http://10.253.100.16:3000/dashboard/predictive-v2
- **Legacy**: http://10.253.100.16:3000/dashboard/dashboard-oficial

## 📦 What's Included

### 5 Production-Ready Dashboards
- Login Page with Authentication
- Executive Dashboard (Main)
- Operational Analytics v2
- Predictive Analytics v2
- Legacy Dashboard (Official)

### Components & Features
- ✅ Navigation Menu (3 responsive variants)
- ✅ Chat Assistant Component
- ✅ 10+ Reusable Components
- ✅ 4 Custom Hooks
- ✅ 5 API Services
- ✅ Design System (Golden Ratio + Bento Grid)
- ✅ 100% Responsive Design
- ✅ Dark Mode Support
- ✅ Complete TypeScript

### Technology Stack
- **Framework**: Next.js 14.2.33
- **UI**: React 18.2.0
- **Styling**: CSS Modules
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript (Strict Mode)
- **Process Manager**: PM2

## 📋 Deployment Options

### Option 1: Direct npm
```bash
cd EXPORT_REACT_DASHBOARDS
npm install --legacy-peer-deps
npm run build
npm start
```

### Option 2: With PM2
```bash
npm install -g pm2
cd EXPORT_REACT_DASHBOARDS
npm install --legacy-peer-deps
npm run build
pm2 start npm --name "dashboard" -- start
pm2 save
pm2 startup
```

### Option 3: Automated Script
```bash
./START_DEPLOYMENT.sh
./manage-remote-dashboard.sh setup
```

## 🛠️ Project Structure

```
EXPORT_REACT_DASHBOARDS/
├── app/
│   ├── dashboard/
│   │   ├── login/
│   │   ├── executive/
│   │   ├── operational-v2/
│   │   ├── predictive-v2/
│   │   └── dashboard-oficial/
│   └── layout.tsx
├── components/
│   ├── NavigationMenu.tsx (NEW - 3 variants)
│   ├── ChatAssistant.tsx
│   ├── ChartBlock.tsx
│   ├── DashboardHeader.tsx
│   └── ... (10+ components)
├── hooks/
│   ├── useGoldenGridLayout.ts
│   ├── useGoldenBreakpoint.ts
│   ├── useBentoGridLayout.ts
│   └── useChartBlocks.ts
├── services/
│   ├── executive-dashboard.service.ts
│   ├── operational-dashboard.service.ts
│   ├── predictive-dashboard.service.ts
│   ├── dashboards-api.service.ts
│   └── api.service.ts
├── styles/
│   ├── corelytics-theme.ts
│   ├── dashboard-components.ts
│   ├── GlobalStyles.tsx
│   └── Dashboard.module.css
├── types/
│   ├── dashboard.ts
│   ├── api.ts
│   └── user.ts
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## 📊 Deployment Scripts

### START_DEPLOYMENT.sh
Automated deployment to remote server. Handles:
- SSH validation
- File compression
- SCP upload
- npm installation
- Build process
- .env.production setup
- systemd service creation

### manage-remote-dashboard.sh
Remote project management:
```bash
./manage-remote-dashboard.sh status     # Check project status
./manage-remote-dashboard.sh logs       # View logs
./manage-remote-dashboard.sh restart    # Restart project
./manage-remote-dashboard.sh start      # Start project
./manage-remote-dashboard.sh stop       # Stop project
./manage-remote-dashboard.sh setup      # Setup PM2
```

## 📚 Documentation

- **00_START_HERE.txt** - Quick start guide
- **DEPLOYMENT_GUIDE.md** - Complete deployment instructions
- **QUICK_REFERENCE.txt** - Command reference
- **DEPLOYMENT_README.txt** - Overview
- **DEPLOYMENT_SUMMARY.txt** - Full summary

## 🔧 Configuration

### Environment Variables (.env.production)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CLICKHOUSE_API=http://10.253.100.16:8123
NEXT_PUBLIC_N8N_WEBHOOK=http://10.253.100.16:5678/webhook
NEXT_PUBLIC_CHAT_API=http://10.253.100.16:3001
NEXT_PUBLIC_APP_NAME=Corelytics AI Monitoring
```

### Dependencies
```json
{
  "dependencies": {
    "recharts": "^2.8.0",
    "lucide-react": "^0.263.0"
  }
}
```

## 📈 Features

### Design System
- **Golden Ratio**: Φ ≈ 1.618 implementation
- **Fibonacci Breakpoints**: 610px, 987px, 1597px, 2584px
- **Responsive Grid**: 5→8→13→21 columns
- **Bento Grid**: Modern card layout
- **Dark Mode**: Elegant dark theme

### Components
- Navigation Menu (Sidebar/Header/Drawer)
- Chat Assistant
- Chart Block
- Dashboard Metric Card
- Hidden Blocks Bar
- + 5 more components

### Hooks
- useGoldenGridLayout
- useGoldenBreakpoint
- useBentoGridLayout
- useChartBlocks

### Services
- executive-dashboard.service
- operational-dashboard.service
- predictive-dashboard.service
- dashboards-api.service
- api.service (base)

## 🚀 Production Ready

- ✅ TypeScript strict mode
- ✅ CSS Modules for scoping
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Error handling
- ✅ Type-safe APIs
- ✅ Build optimization
- ✅ PM2 configuration

## 🛠️ Requirements

- Node.js 18+
- npm 9+
- PM2 (optional, for production)

## 📞 Support

Check documentation files for detailed guides:
- Deployment issues: See DEPLOY_GUIDE.md
- Command reference: See QUICK_REFERENCE.txt
- Quick start: See 00_START_HERE.txt

## 📄 License

All rights reserved.

---

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Updated**: Nov 17, 2025
