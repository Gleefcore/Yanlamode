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
  Search,
  ChevronRight,
  MoreVertical,
  Sparkles,
  Sun,
  Moon,
  Compass,
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Catalogue Créations', href: '/admin/creations', icon: Shirt },
  { name: 'Demandes & CRM', href: '/admin/demandes', icon: Inbox, badgeKey: 'newDemands' },
  { name: 'Collections', href: '/admin/collections', icon: FolderKanban },
  { name: 'Analytics & Trafic', href: '/admin/analytics', icon: TrendingUp },
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
  const [newDemandsCount, setNewDemandsCount] = useState(3);
  const [checkingAuth, setCheckingAuth] = useState(true);

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
    return <div className="min-h-screen bg-[#F4F5F7] text-[#1A1A1A]">{children}</div>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center text-xs text-gray-500 uppercase tracking-widest font-medium">
        Vérification des accès administrateur...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1F2937] flex font-sans antialiased">
      {/* Sidebar Desktop (White Clean Knowvio Style) */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-gray-200/80 bg-white p-6 shrink-0 shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
        <div className="space-y-7">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black p-0.5 shadow-sm">
                <Image src="/images/brand/logo.jpg" alt="YANLAMODE" fill className="object-contain" />
              </div>
              <div>
                <span className="font-serif-luxe text-lg tracking-wider font-bold text-gray-900 block leading-tight">
                  YANLAMODE
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#C5A880] font-semibold block">
                  Studio Cockpit
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold px-3 block mb-2">
              Menu Principal
            </span>
            <nav className="space-y-1.5">
              {ADMIN_NAV.map((item) => {
                const IconComp = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-sm shadow-gray-900/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      <span className="tracking-wide text-xs">{item.name}</span>
                    </div>
                    {item.badgeKey && newDemandsCount > 0 && (
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                          isActive
                            ? 'bg-[#C5A880] text-black'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        {newDemandsCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Studio Banner Card (Knowvio Orange/Gold Promo Card Style) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF5EF] to-[#F5ECE0] border border-[#E8DEC8] space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D42] bg-[#EAD8B8]/60 px-2 py-0.5 rounded-md">
                Atelier Privé
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Maison Haute Couture</p>
              <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">
                Expéditions : Cameroun, Europe & Canada.
              </p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-900 text-white rounded-xl text-[11px] font-semibold hover:bg-black transition-colors"
            >
              <span>Aperçu Vitrine</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom User Profile Section (Knowvio style with avatar, name, logout) */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#C5A880]/20 border border-[#C5A880] text-[#8C6D42] flex items-center justify-center font-serif-luxe font-bold text-sm shrink-0">
                YM
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">Maître Couturier</p>
                <p className="text-[10px] text-gray-500 truncate">admin@yanlamode.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (Knowvio Clean White) */}
        <header className="h-20 border-b border-gray-200/80 bg-white px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Bienvenue, Maître Couturier !
              </h2>
              <p className="text-xs text-gray-500 hidden sm:block">
                Atelier YANLAMODE · Votre espace de gestion haute couture & commandes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Public Site Link */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3EFEA] hover:bg-[#EAE4D9] text-[#8C6D42] rounded-xl text-xs sm:text-sm font-bold transition-colors"
            >
              <span>Voir le Site Public</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 p-4 space-y-2 shadow-lg">
            {ADMIN_NAV.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium ${
                    isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badgeKey && newDemandsCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] rounded-full font-bold border border-red-200">
                      {newDemandsCount}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-gray-100 flex justify-between">
              <Link href="/" target="_blank" className="text-xs text-gray-900 font-semibold py-2">
                Voir site public
              </Link>
              <button onClick={handleLogout} className="text-xs text-red-600 font-semibold py-2">
                Déconnexion
              </button>
            </div>
          </div>
        )}

        {/* Content View with clean Knowvio gray canvas */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto bg-[#F4F5F7]">
          {children}
        </main>
      </div>
    </div>
  );
}
