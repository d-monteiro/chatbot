# VotaAI Chatbot Platform

VotaAI is a modern, responsive chat application built with React, TypeScript, and Vite. It provides an intuitive interface for users to interact with an AI assistant.

## Features

- **Sleek, Modern UI**: Clean design with responsive layout that works on all devices
- **Interactive Chat Interface**: Real-time messaging with user and bot messages
- **User Authentication**: Login and registration functionality
- **React Router Navigation**: Smooth transitions between pages
- **Tailwind CSS Styling**: Customizable, utility-first CSS framework

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Shadcn UI components
│   │   └── ...
│   ├── pages/           # Application pages
│   │   ├── Index.tsx    # Landing page
│   │   ├── ChatPage.tsx # Chat interface
│   │   ├── About.tsx    # About page
│   │   ├── Login.tsx    # User login
│   │   └── ...
│   ├── router.tsx       # Application routing
│   └── ...
├── public/              # Static assets
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/votaai.git
   cd votaai
   ```

2. Install dependencies
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies (if applicable)
   cd ../backend
   npm install
   ```

3. Start the development server
   ```bash
   # Start frontend
   cd frontend
   npm run dev
   
   # Start backend (in a separate terminal)
   cd backend
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - React Router
  - Tailwind CSS
  - Lucide Icons
  - Shadcn UI Components

- **Backend** (API Integration):
  - Node.js
  - Express
## Development

### Commands

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Lucide Icons](https://lucide.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
```
