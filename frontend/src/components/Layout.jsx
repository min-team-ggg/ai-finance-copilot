import { Outlet } from 'react-router-dom'
import { Layout as LayoutIcon, FileText, Home } from 'lucide-react'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <LayoutIcon className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold text-text-primary">Finance Copilot</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                <Home className="w-4 h-4" />
                Dashboard
              </a>
              <a href="/reports" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                <FileText className="w-4 h-4" />
                Reports
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Navigation */}
          <nav className="lg:hidden flex items-center justify-center gap-4 bg-surface rounded-lg p-3 shadow-sm border border-gray-200">
            <a href="/" className="flex items-center gap-2 text-text-primary">
              <Home className="w-4 h-4" />
              Dashboard
            </a>
            <span className="text-gray-300">|</span>
            <a href="/reports" className="flex items-center gap-2 text-text-primary">
              <FileText className="w-4 h-4" />
              Reports
            </a>
          </nav>

          {/* Content Area */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
