'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Shirt,
  FolderKanban,
  Inbox,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bell,
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics & Trafic', href: '/admin/analytics', icon: TrendingUp },
  { name: 'Gestion Créations', href: '/admin/creations', icon: Shirt },
  { name: 'Collections', href: '/admin/collections', icon: FolderKanban },
  { name: 'Demandes & CRM', href: '/admin/demandes', icon: Inbox, badgeKey: 'newDemands' },
  { name: 'Paramètres Site', href: '/admin/parametres', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newDemandsCount, setNewDemandsCount] = useState(1);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Si on est sur la page de login admin, ne pas afficher le shell d'administration
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    async function verifyAuth() {
      try {
        const res = await fetch('/api/auth');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/admin/login');
        } else {
          setCheckingAuth(false);
        }
      } catch (e) {
        router.replace('/admin/login');
      }
    }
    verifyAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.replace('/admin/login');
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#070707] text-[#FBF9F5]">{children}</div>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center text-xs text-[#737373] uppercase tracking-widest">
        Vérification des accès administrateur...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#FBF9F5] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-[#1C1C1C] bg-[#0C0C0C] p-6 shrink-0">
        <div className="space-y-8">
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white p-0.5 border border-[#C5A880]">
              <Image src="/images/brand/logo.jpg" alt="YANLAMODE" fill className="object-contain" />
            </div>
            <div>
              <span className="font-serif-luxe text-base tracking-widest uppercase font-bold text-white">
                YANLAMODE
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-[#C5A880]">
                Cockpit Admin
              </span>
            </div>
          </div>

          {/* Nav items */}
          <nav className="space-y-1.5">
            {ADMIN_NAV.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#C5A880] text-black font-semibold shadow-md'
                      : 'text-[#A3A3A3] hover:text-white hover:bg-[#141414]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badgeKey && newDemandsCount > 0 && (
                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                      isActive ? 'bg-black text-[#C5A880]' : 'bg-red-500 text-white'
                    }`}>
                      {newDemandsCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-6 border-t border-[#1C1C1C]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#737373] hover:text-[#C5A880] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Voir le site public</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-sm transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-[#1C1C1C] bg-[#0C0C0C]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#A3A3A3] hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[#A3A3A3]">Système Haute Couture opérationnel</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-[#737373] bg-[#141414] px-3 py-1.5 border border-[#222222] rounded-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Session Admin Sécurisée</span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0C0C0C] border-b border-[#1C1C1C] p-4 space-y-2">
            {ADMIN_NAV.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-sm text-xs ${
                    isActive ? 'bg-[#C5A880] text-black font-semibold' : 'text-[#A3A3A3]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badgeKey && newDemandsCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                      {newDemandsCount}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#1C1C1C] flex justify-between">
              <Link href="/" target="_blank" className="text-xs text-[#C5A880] py-2">
                Voir site public
              </Link>
              <button onClick={handleLogout} className="text-xs text-red-400 py-2">
                Déconnexion
              </button>
            </div>
          </div>
        )}

        {/* Content View */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
