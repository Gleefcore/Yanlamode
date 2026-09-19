'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@yanlamode.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.replace('/admin');
      } else {
        setError(data.error || 'Identifiants invalides.');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0F0F0F] border border-[#222222] rounded-sm p-8 sm:p-10 space-y-8 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white p-1 mx-auto border-2 border-[#C5A880]">
            <Image
              src="/images/brand/logo.jpg"
              alt="YANLAMODE Haute Couture"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-serif-luxe text-2xl text-white uppercase tracking-wider">
              YANLAMODE
            </h1>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] block">
              Espace Administrateur Sécurisé
            </span>
          </div>
          <p className="text-xs text-[#737373]">
            Cockpit de gestion des créations, suivi des commandes et tableau de bord.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
              Identifiant Administrateur
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#262626] rounded-sm text-xs text-white placeholder-[#525252] focus:outline-none focus:border-[#C5A880]"
                placeholder="admin@yanlamode.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#262626] rounded-sm text-xs text-white placeholder-[#525252] focus:outline-none focus:border-[#C5A880]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <span>Authentification...</span>
            ) : (
              <>
                <span>Accéder au Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] text-[#525252]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            Accès protégé SSL
          </span>
          <span>Identifiants par défaut pré-remplis</span>
        </div>
      </div>
    </div>
  );
}
