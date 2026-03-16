# AI Job Prioritization Platform

An intelligent job search platform that automatically scrapes job listings, analyzes them with AI, and prioritizes opportunities based on your profile and preferences.

## Project Structure

This is a monorepo containing two main applications:

```
AI-Job/
├── apps/
│   ├── api/          # Express.js backend API
│   └── web/my-app/   # Next.js frontend application
```

### Apps

- **[@ai-job/api](./apps/api)** - Backend API server built with Express.js, TypeScript, MongoDB, and Redis
  - Job scraping with Puppeteer
  - AI-powered job matching using Google Generative AI
  - Background workers for automated tasks
  - RESTful API endpoints

- **[my-app](./apps/web/my-app)** - Frontend web application built with Next.js 16 and React 19
  - Modern UI with TailwindCSS v4 and shadcn/ui components
  - State management with Zustand
  - Animations with Framer Motion

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Queue/Cache**: Redis (with BullMQ)
- **AI**: Google Generative AI
- **Web Scraping**: Puppeteer with stealth plugins
- **Validation**: Zod, express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, express-rate-limit

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui, Radix UI
- **State**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Utilities**: date-fns, class-variance-authority

## Prerequisites

- Node.js 20+
- MongoDB instance
- Redis instance
- Google AI API key (for job matching features)

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd AI-Job

# Install API dependencies
cd apps/api
npm install

# Install Web dependencies
cd ../web/my-app
npm install
```

### 2. Environment Setup

Create `.env` files in both application directories:

**`apps/api/.env`**:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ai-job
REDIS_URL=redis://localhost:6379
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

**`apps/web/my-app/.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Start Development Servers

**Terminal 1 - API Server:**
```bash
cd apps/api
npm run dev
```

**Terminal 2 - Web App:**
```bash
cd apps/web/my-app
npm run dev
```

The web app will be available at `http://localhost:3000` and the API at `http://localhost:3001`.

## Available Scripts

### API (`apps/api`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run worker:scraper` | Start job scraping worker |
| `npm run worker:ai` | Start AI matching worker |
| `npm run worker:cleanup` | Start cleanup worker |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

### Web (`apps/web/my-app`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Features

- **Automated Job Scraping**: Automatically scrapes job listings from multiple sources
- **AI-Powered Matching**: Uses Google's Generative AI to analyze and score job relevance
- **Smart Prioritization**: Ranks jobs based on your skills, experience, and preferences
- **Background Workers**: Handles scraping, AI processing, and cleanup tasks asynchronously
- **Modern Web Interface**: Clean, responsive UI for browsing and managing job opportunities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)
