# Home Banking Monorepo

A full-stack home banking application with API, frontend, and end-to-end tests.

## Architecture

- **API**: ASP.NET Core 9 Web API with EF Core InMemory
- **Frontend**: React + Vite + TypeScript with Tailwind CSS and shadcn/ui
- **Tests**: xUnit API tests + Playwright E2E tests
- **CI/CD**: GitHub Actions workflow
- **Development**: devcontainer configuration for GitHub Codespaces

## Features

### API (src/api)
- ASP.NET Core 9 Web API controllers
- Entity Framework Core InMemory database
- Seed data: 3 accounts and 22 transactions
- Scalar OpenAPI documentation
- Health check endpoint
- CORS configuration for frontend

### Frontend (src/web)
- React + Vite + TypeScript (react-swc-ts template)
- Tailwind CSS v3 + shadcn/ui components
- Dark theme by default
- Account balance cards
- Transactions table with category badges
- Transfer form with client-side validation
- Responsive design

### Testing
- **xUnit API Tests**: 9 tests covering API endpoints
- **Playwright E2E Tests**: 10 tests covering dashboard load, transaction list, and transfer flow

## Prerequisites

- .NET 9 SDK
- Node.js 20+
- npm or yarn

## Getting Started

### Option 1: Using GitHub Codespaces
1. Click "Code" → "Codespaces" → "Create codespace on main"
2. Wait for the devcontainer to build and dependencies to install
3. The API and frontend will be ready to run

### Option 2: Local Development

#### Clone the repository
```bash
git clone https://github.com/jfonseca-it/homeBankingMono.git
cd homeBankingMono
```

#### Run the API
```bash
cd src/api/HomeBanking.Api
dotnet restore
dotnet run
```
API will be available at `http://localhost:5000`
- Health check: `http://localhost:5000/health`
- Scalar API docs: `http://localhost:5000/scalar/v1`
- OpenAPI spec: `http://localhost:5000/openapi/v1.json`

#### Run the Frontend
```bash
cd src/web
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`

## Testing

### Run API Tests
```bash
cd src/api/HomeBanking.Api.Tests
dotnet test
```

### Run E2E Tests
**Note**: Both API and frontend must be running before executing E2E tests.

```bash
# Terminal 1: Start API
cd src/api/HomeBanking.Api
dotnet run

# Terminal 2: Start frontend
cd src/web
npm run dev

# Terminal 3: Run E2E tests
cd tests/e2e
npm install
npx playwright install chromium
npm test
```

To run E2E tests with UI:
```bash
cd tests/e2e
npm run test:ui
```

## Project Structure

```
homeBankingMono/
├── .devcontainer/
│   └── devcontainer.json          # Codespaces configuration
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI workflow
├── src/
│   ├── api/
│   │   ├── HomeBanking.Api/       # Main API project
│   │   │   ├── Controllers/       # API controllers
│   │   │   ├── Data/              # Database context
│   │   │   ├── Models/            # Domain models
│   │   │   └── Program.cs         # API startup
│   │   └── HomeBanking.Api.Tests/ # xUnit tests
│   └── web/
│       ├── src/
│       │   ├── components/        # React components
│       │   │   └── ui/            # shadcn/ui components
│       │   ├── lib/               # Utility functions
│       │   ├── types/             # TypeScript types
│       │   ├── App.tsx            # Main app component
│       │   └── main.tsx           # Entry point
│       ├── package.json
│       └── vite.config.ts
└── tests/
    └── e2e/
        ├── tests/                 # Playwright E2E tests
        │   ├── dashboard.spec.ts
        │   ├── transactions.spec.ts
        │   └── transfer.spec.ts
        └── playwright.config.ts
```

## API Endpoints

### Accounts
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/{id}` - Get account by ID

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/account/{accountId}` - Get transactions by account

### Transfers
- `POST /api/transfers` - Create a transfer between accounts

### Health
- `GET /health` - Health check endpoint

## Technologies

### Backend
- ASP.NET Core 9
- Entity Framework Core 9
- EF Core InMemory
- Scalar.AspNetCore
- xUnit

### Frontend
- React 18
- Vite 7
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui components
- Lucide React icons

### Testing & CI/CD
- Playwright
- GitHub Actions
- Docker (devcontainer)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything passes
5. Submit a pull request

## License

MIT
