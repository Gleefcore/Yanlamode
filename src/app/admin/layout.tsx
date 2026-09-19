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
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F5] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-white/[0.08] bg-[#0E0E12] p-6 shrink-0">
        <div className="space-y-8">
          {/* Brand header */}
          <div className="flex items-center gap-3.5 pb-2 border-b border-white/[0.06]">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white p-0.5 border border-[#C5A880]/70 shadow-sm">
              <Image src="/images/brand/logo.jpg" alt="YANLAMODE" fill className="object-contain" />
            </div>
            <div>
              <span className="font-serif-luxe text-base tracking-[0.22em] uppercase font-bold text-white block">
                YANLAMODE
              </span>
              <span className="text-[8.5px] uppercase tracking-[0.32em] text-[#C5A880] font-medium block">
                Studio Cockpit
              </span>
            </div>
          </div>

          {/* Nav items */}
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#C5A880] text-[#09090B] font-semibold shadow-sm'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-[#09090B]' : 'text-[#71717A]'}`} />
                    <span className="tracking-wide">{item.name}</span>
                  </div>
                  {item.badgeKey && newDemandsCount > 0 && (
                    <span className={`px-2 py-0.5 text-[9.5px] rounded-full font-bold ${
                      isActive ? 'bg-[#09090B] text-[#C5A880]' : 'bg-[#C5A880] text-[#09090B]'
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
        <div className="space-y-2 pt-6 border-t border-white/[0.06]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#71717A] hover:text-[#C5A880] transition-colors font-medium tracking-wide"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Aperçu du site public</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F43F5E] hover:text-[#FB7185] hover:bg-red-950/20 rounded-sm transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-white/[0.08] bg-[#0E0E12]/90 backdrop-blur-xl px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#A1A1AA] hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
              <span className="w-2 h-2 rounded-full bg-[#C5A880] shadow-[0_0_6px_#C5A880]" />
              <span className="hidden sm:inline tracking-wider uppercase text-[10.5px]">Maison YANLAMODE · Atelier Haute Couture</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] bg-white/[0.03] px-3.5 py-1.5 border border-white/[0.08] rounded-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="text-[11px] tracking-wide">Session Sécurisée</span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0E0E12] border-b border-white/[0.08] p-4 space-y-2">
            {ADMIN_NAV.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-sm text-xs ${
                    isActive ? 'bg-[#C5A880] text-[#09090B] font-semibold' : 'text-[#A1A1AA]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badgeKey && newDemandsCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#C5A880] text-[#09090B] text-[10px] rounded-full font-bold">
                      {newDemandsCount}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-white/[0.08] flex justify-between">
              <Link href="/" target="_blank" className="text-xs text-[#C5A880] py-2 font-medium">
                Voir site public
              </Link>
              <button onClick={handleLogout} className="text-xs text-[#F43F5E] py-2 font-medium">
                Déconnexion
              </button>
            </div>
          </div>
        )}

        {/* Content View */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto bg-[#09090B]">
          {children}
        </main>
      </div>
    </div>
  );
}
