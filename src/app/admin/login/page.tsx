'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial luxury ambient light */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#C5A880]/10 blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-md w-full bg-[#0E0E12]/90 backdrop-blur-xl border border-white/[0.1] rounded-sm p-8 sm:p-12 space-y-8 shadow-2xl relative z-10">
        {/* Header with Luxury Crest */}
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white p-1 mx-auto border-2 border-[#C5A880] shadow-lg shadow-[#C5A880]/20">
            <Image
              src="/images/brand/logo.jpg"
              alt="YANLAMODE Haute Couture"
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold block">
              Studio Cockpit · Salon Privé
            </span>
            <h1 className="font-serif-luxe text-3xl text-white tracking-wide">
              YANLAMODE
            </h1>
          </div>

          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Espace d’administration hautement sécurisé pour la gestion du catalogue, le pilotage des commandes WhatsApp et les fiches de mesures.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs rounded-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1.5 uppercase tracking-wider font-medium">
              Identifiant Studio
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-sm text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880] transition-colors"
                placeholder="admin@yanlamode.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1.5 uppercase tracking-wider font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-sm text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-[0.22em] rounded-sm hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C5A880]/15 disabled:opacity-50 hover:scale-[1.02]"
          >
            {loading ? (
              <span>Vérification des accès...</span>
            ) : (
              <>
                <span>Accéder au Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            Chiffrement SSL 256-bit
          </span>
          <span className="text-zinc-500">Accès réservé</span>
        </div>
      </div>
    </div>
  );
}
