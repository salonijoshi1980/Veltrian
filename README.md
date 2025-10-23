# Veltrian

A modern web application built with React, Vite, and React Router.

## Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v7
- **Build Tool**: Vite v6
- **Styling**: Tailwind CSS v3
- **Authentication**: Clerk
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Chakra UI, Lucide React icons
- **Charts**: Recharts
- **Testing**: Vitest (unit), Cypress (E2E)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd veltrian
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

4. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your environment variables, particularly:
   - `VITE_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
   - `VITE_CLERK_SIGN_IN_URL` - Path to the sign-in page (e.g., /login)
   - `VITE_CLERK_SIGN_UP_URL` - Path to the sign-up page (e.g., /signup)
   - `VITE_CLERK_AFTER_SIGN_IN_URL` - Post sign-in redirect (e.g., /app)
   - `VITE_CLERK_AFTER_SIGN_UP_URL` - Post sign-up redirect (e.g., /app)

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Building for Production

Create a production build:

```bash
npm run build
# or
yarn build
```

Preview the production build:

```bash
npm run preview
# or
yarn preview
```

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
# or
yarn typecheck
```

## Project Structure

```text
src/
├── app/              # App router structure
│   ├── api/          # API routes
│   ├── login/        # Login page
│   └── ...           # Other pages
├── utils/            # Utility functions
├── client-integrations/ # Third-party UI integrations
└── __create/         # Templates and scaffolding
```

## Authentication

This project uses Clerk for authentication. Make sure to set up your Clerk account and configure the required environment variables.

## Available Scripts

- `dev`: Start the development server
- `build`: Create a production build
- `preview`: Preview the production build
- `typecheck`: Run TypeScript type checking

## Learn More

To learn more about the technologies used in this project:

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Clerk Documentation](https://clerk.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Deployment

This application can be deployed to various platforms that support Node.js applications, such as Vercel, Netlify, or traditional hosting providers.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request
