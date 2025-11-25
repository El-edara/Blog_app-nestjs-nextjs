<<<<<<< HEAD
📝 Blogify - Modern Full-Stack Blogging Platform

✨ Features
🔐 Authentication & Authorization

✅ Secure JWT-based authentication with refresh tokens
✅ HTTP-only cookies for enhanced security
✅ Role-based access control (USER, ADMIN)
✅ Protected routes with automatic token refresh
✅ Session management with encrypted cookies

📝 Blog Management

✅ Create, edit, and delete blog posts
✅ Publish/Draft status toggle
✅ Rich text content support
✅ Post search and filtering
✅ Advanced pagination with numbered pages
✅ Author attribution and timestamps
✅ Post view counts and engagement metrics

💬 Comments System

✅ Threaded comments on blog posts
✅ Real-time comment updates
✅ Edit and delete own comments
✅ Comment moderation for admins
✅ User avatars and timestamps

👑 Admin Dashboard

✅ Real-time Statistics Dashboard

Total users, posts, comments
Published vs draft posts ratio
Recent activity feed

✅ User Management

View all users with stats
Change user roles (USER ↔ ADMIN)
Delete users and their content
Cannot modify own account

✅ Content Moderation

Manage all posts (view, delete)
Manage all comments (view, delete)
Filter by status and author

✅ Activity Monitoring

Recent users registration
Recent posts created
Recent comments added

🎨 UI/UX Excellence

✅ Fully responsive design (mobile, tablet, desktop)
✅ Dark mode with seamless transitions
✅ Smooth animations with Framer Motion
✅ Skeleton loading states
✅ Toast notifications
✅ Error boundaries
✅ Accessible components (WCAG compliant)

⚡ Performance Optimizations

✅ Server-side rendering (SSR)
✅ Incremental Static Regeneration (ISR)
✅ Smart caching strategy:

Posts list: 60s revalidation
Single post: 120s revalidation
Personal data: No cache

✅ Image optimization with Next.js Image
✅ Code splitting and lazy loading
✅ Database query optimization with Prisma

🔒 Security

✅ SQL injection prevention (Prisma)
✅ XSS protection
✅ CSRF protection
✅ Rate limiting ready
✅ Secure password hashing (Argon2)
✅ Environment variable validation

## Tech Stack

| Layer    | Technology                                         |
| -------- | -------------------------------------------------- |
| Monorepo | [Turborepo](https://turbo.build/repo)              |
| Frontend | Next.js 15 (App Router), React, Tailwind CSS       |
| Backend  | NestJS, Prisma ORM, PostgreSQL                     |
| Auth     | JWT + Refresh Tokens (jose)                        |
| UI       | Framer Motion, Lucide Icons, Sonner                |
| Shared   | `@repo/ui`, `@repo/types`, ESLint/Prettier configs |

All code is **100% TypeScript**.

📁 Project Structure

blog-app/
├── apps/
│ ├── api/ # NestJS Backend
│ │ ├── src/
│ │ │ ├── auth/ # Authentication module
│ │ │ ├── users/ # Users management
│ │ │ ├── posts/ # Posts module
│ │ │ ├── comments/ # Comments module
│ │ │ ├── admin/ # Admin panel module
│ │ │ ├── cloudinary/ # Image upload
│ │ │ ├── common/ # Guards, decorators, interceptors
│ │ │ ├── prisma/ # Prisma service
│ │ │ └── etc... # Other modules
│ │ ├── prisma/
│ │ │ ├── schema.prisma # Database schema
│ │ │ ├── seed.ts # Database seeding
│ │ │ └── migrations/ # Database migrations
│ │ └── package.json
│ │
│ └── web/ # Next.js Frontend
│ ├── app/
│ │ ├── (auth)/ # Auth pages (login, register)
│ │ ├── (main)/ # Main app pages
│ │ │ ├── posts/ # Posts pages
│ │ │ ├── profile/ # Profile pages
│ │ │ ├── dashboard/# Dashboard pages
│ │ │ └── admin/ # Admin panel pages
│ │ └── etc... # Other pages
│ ├── components/
│ │ ├── layout/ # Navbar, Footer
│ │ ├── posts/ # Post components
│ │ ├── comments/ # Comment components
│ │ ├── admin/ # Admin components
│ │ ├── ui/ # Reusable UI components
│ │ └── etc... # Other components
│ ├── lib/
│ │ ├── actions/ # Server actions
│ │ ├── validations/ # Zod schemas
│ │ ├── utils/ # Utility functions
│ │ ├── session.ts # Session management
│ │ ├── authFetch.ts # Authenticated HTTP requests
│ │ └── etc... # Other utils
│ └── package.json
│
├── packages/ # Shared packages (optional)
├── turbo.json # Turborepo configuration
├── package.json # Root package.json
└── pnpm-workspace.yaml # pnpm workspace config

🚀 Getting Started
Prerequisites

Node.js 18+
pnpm 8+
PostgreSQL 14+ (or Neon/Supabase)

Installation

Clone the repository

bashgit clone https://github.com/yourusername/blog-app.git
cd blog-app

Install dependencies

bashpnpm install

Setup Backend Environment

bashcd apps/api
cp .env.example .env
Edit .env:
DATABASE_URL=postgresql://user:password@host:port/dbname
PORT=4000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=15m
REFRESH_JWT_SECRET=your_refresh_jwt_secret_here
REFRESH_JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV="development"
ORIGIN="http://localhost:3000"

Setup Frontend Environment

bashcd apps/web
cp .env.example .env.local
Edit .env.local:
envNEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXT_PUBLIC_SESSION_SECRET_KEY="your-session-secret-min-32-chars"
NEXT_PUBLIC_URL="http://localhost:3000"

Setup Database

bashcd apps/api

# Generate Prisma Client

npx prisma generate

# Run migrations

npx prisma migrate dev

# Seed database (optional)

pnpm seed

Run Development Servers

In the root directory:
bash# Run both frontend and backend
pnpm dev

# Or run separately:

# Backend: pnpm dev --filter=api

# Frontend: pnpm dev --filter=web

Backend: http://localhost:4000
Frontend: http://localhost:3000

🧪 Default Credentials
After seeding, you can login with:
Admin Account:
Email: admin@blog.com
Password: Password123*
Regular Users:
Email: user1@blog.com, user2@blog.com, ..., user5@blog.com
Password: Password123*
=======
# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47
