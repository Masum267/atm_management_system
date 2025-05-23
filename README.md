# ATM Management System

A full-stack ATM Management System built with Next.js, MySQL, and Tailwind CSS.

## Features

- User authentication (login/register)
- Account management
- Transaction processing (withdraw, deposit, transfer)
- Transaction history
- Responsive design

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions
- **Database**: MySQL
- **Authentication**: Cookie-based with bcrypt for password hashing

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL Server

### Database Setup

1. Create a MySQL database:

\`\`\`bash
mysql -u root -p < db/schema.sql
\`\`\`

Or run:

\`\`\`bash
npm run setup-db
\`\`\`

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=atm_system
\`\`\`

### Installation

1. Install dependencies:

\`\`\`bash
npm install
\`\`\`

2. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - React components
- `/lib` - Utility functions, database connection, and server actions
- `/db` - Database schema and migrations

## Usage

1. Register a new account
2. Login with your credentials
3. Use the dashboard to manage your account and perform transactions

## License

MIT
#   a t m _ m a n a g e m e n t _ s y s t e m  
 