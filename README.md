Nitya Mora

A modern React-based web application built with Vite, TypeScript, Tailwind CSS, and shadcn/ui.
The project focuses on delivering a fast, scalable, and well-structured frontend architecture with reusable UI components and modern development tooling.

Overview

Nitya Mora is a modern web application built using a performant frontend stack. The project leverages Vite for fast builds, React for component-driven UI development, and Tailwind CSS with shadcn/ui for clean, customizable design systems.

The architecture is designed to support scalability, maintainability, and rapid development. It includes modern state management, form validation, routing, and testing support.

Tech Stack

Frontend

React 18

TypeScript

Vite

UI & Styling

Tailwind CSS

shadcn/ui

Radix UI primitives

Framer Motion (animations)

Lucide React (icons)

State & Data Management

React Query

React Hook Form

Zod (validation)

Utilities

clsx

class-variance-authority

date-fns

Testing

Vitest

Testing Library

Playwright

Project Structure
nitya-mora/
│
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Application pages
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── styles/           # Global styles
│   └── main.tsx          # Application entry point
│
├── components.json       # shadcn configuration
├── tailwind.config.ts    # Tailwind configuration
├── vite.config.ts        # Vite configuration
├── package.json
└── README.md
Installation

Clone the repository:

git clone <your-repository-url>

Navigate to the project directory:

cd nitya-mora

Install dependencies:

npm install
Running the Project

Start the development server:

npm run dev

The application will run on:

http://localhost:5173
Build for Production
npm run build

Preview the production build:

npm run preview
Testing

Run tests:

npm run test

Run tests in watch mode:

npm run test:watch
Linting

Run ESLint:

npm run lint
Key Features

Modern React + TypeScript architecture

Component-driven development

Accessible UI components via Radix

Fully customizable Tailwind design system

Form validation with React Hook Form + Zod

API state management using React Query

Built-in testing setup

Fast development with Vite

Deployment

The project can be deployed on platforms such as:

Vercel

Netlify

Cloudflare Pages

AWS Amplify

Typical deployment steps:

npm run build

Upload the generated dist/ folder to your hosting provider.

Contributing

Contributions are welcome.

Fork the repository

Create a feature branch

Commit your changes

Open a pull request

License

This project is licensed under the MIT License.
