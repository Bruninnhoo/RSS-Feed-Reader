import { Search, Bell, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)] flex items-center justify-between px-6 flex-shrink-0 transition-colors">
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">All Feeds</h2>

      <div className="flex flex-1 max-w-xl mx-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[var(--color-text-tertiary)]" />
        </div>
        <input
          type="search"
          placeholder="Search feeds..."
          className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors placeholder:text-[var(--color-text-tertiary)]"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors p-1"
          title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"></div>
      </div>
    </header>
  );
}
