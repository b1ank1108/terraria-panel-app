import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, Terminal, Database } from 'lucide-react';

export function MainLayout() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: '仪表盘' },
    { to: '/config', icon: Settings, label: '配置' },
    { to: '/console', icon: Terminal, label: '控制台' },
    { to: '/backups', icon: Database, label: '备份' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Terraria-style sidebar */}
      <aside className="w-64 bg-gradient-to-b from-terra-bg-light to-terra-bg text-white flex flex-col border-r-4 border-terra-wood-dark">
        <div className="p-6 border-b-2 border-terra-gold">
          <h1 className="terra-heading text-xl">🎮 Terraria 管理面板</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 transition-all border-2 ${
                  isActive
                    ? 'bg-terra-wood text-white border-terra-gold shadow-terra-sm'
                    : 'text-slate-400 border-transparent hover:bg-terra-bg-light hover:text-terra-gold hover:border-terra-wood'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-bold uppercase text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-terra-bg-card border-b-4 border-terra-wood-dark px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="terra-heading text-lg">服务器管理</h2>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
