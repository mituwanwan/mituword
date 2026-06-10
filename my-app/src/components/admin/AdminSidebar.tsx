'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: '/admin', label: '仪表盘', icon: '📊' },
  { href: '/admin/projects', label: '项目管理', icon: '💻' },
  { href: '/admin/diaries', label: '日记管理', icon: '📝' },
  { href: '/admin/music', label: '音乐管理', icon: '🎵' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isVoid } = useTheme();

  return (
    <aside className={`
      w-64 min-h-screen flex flex-col
      ${isVoid ? 'glass border-r border-void-purple/20' : 'glass-solar border-r border-realm-sun/20'}
    `}>
      {/* Logo */}
      <div className="p-6 border-b dark:border-void-purple/20 border-realm-sun/20">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="text-2xl">🚀</span>
          <div>
            <h1 className={`font-bold text-lg ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
              管理后台
            </h1>
            <p className={`text-xs ${isVoid ? 'text-void-dust/60' : 'text-realm-mist/60'}`}>
              MituWorld Admin
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive
                  ? isVoid
                    ? 'bg-void-purple/20 text-void-star border border-void-purple/30'
                    : 'bg-realm-sky/20 text-realm-foreground border border-realm-sky/30'
                  : isVoid
                    ? 'text-void-dust/80 hover:bg-void-purple/10 hover:text-void-star'
                    : 'text-realm-mist/80 hover:bg-realm-sky/10 hover:text-realm-foreground'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isVoid ? 'bg-void-sun' : 'bg-realm-sun'}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t dark:border-void-purple/20 border-realm-sun/20">
        <Link
          href="/"
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
            ${isVoid
              ? 'text-void-dust/60 hover:bg-void-purple/10 hover:text-void-star'
              : 'text-realm-mist/60 hover:bg-realm-sky/10 hover:text-realm-foreground'
            }
          `}
        >
          <span>←</span>
          <span>返回网站</span>
        </Link>
      </div>
    </aside>
  );
}
