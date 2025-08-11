# TrainWithShubham Community Hub

A Next.js application for the TrainWithShubham community, featuring interview questions, job listings, and AI-powered search functionality.

## Features

- 🔍 **AI-Powered Question Search**: Intelligent search through interview questions using Google AI (Gemini)
- 📚 **Interview Questions**: Comprehensive collection of scenario-based and traditional interview questions
- 💼 **Job Listings**: Curated job opportunities for the community
- 🏆 **Leaderboard**: Community contributor rankings
- 🔐 **Authentication**: Firebase-based authentication with Google and GitHub
- 📊 **Community Stats**: Real-time community statistics

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Firebase Auth
- **AI**: Google AI (Gemini) via Genkit
- **Data**: Google Sheets integration
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trainwithshubham.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your actual values:
   - Firebase configuration 
   - Google AI API key

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

This project uses environment variables for configuration. See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for detailed setup instructions.

### Quick Setup

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
# ... other Firebase variables

# Google AI Configuration  
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run env:check` - Verify environment variables are loaded

## Project Structure

```
src/
├── ai/                    # AI-related functionality
│   ├── flows/            # AI workflows
│   ├── dev.ts            # Genkit development entry
│   └── genkit.ts         # AI configuration
├── app/                   # Next.js app router pages
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── contexts/              # React contexts
├── data/                  # Static data and types
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   └── firebase/         # Firebase configuration
└── services/              # External service integrations
    └── google-sheets.ts   # Google Sheets API
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Security

- Environment variables are used for all sensitive configuration
- Firebase API keys are client-side safe but should be rotated regularly
- Google AI API keys are server-side only
- All secrets are excluded from version control

## Deployment

The application is configured for Firebase Hosting deployment. See `apphosting.yaml` for configuration details.

## License

This project is part of the TrainWithShubham community.
