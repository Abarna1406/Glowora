import React from 'react'
import { Check } from 'lucide-react'
import { Container, SectionHeading } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { membershipTiers } from '../lib/data.js'
import toast from 'react-hot-toast'

export default function Membership() {
  const [loadingId, setLoadingId] = React.useState(null)

  const handleUpgrade = (t) => {
    if (t.price === 0) {
      toast('You are already on the Free plan', { icon: 'ℹ️' });
      return;
    }
    setLoadingId(t.id);
    const toastId = toast.loading(`Processing payment for ${t.name} tier...`);
    
    setTimeout(() => {
      toast.success(`Successfully upgraded to ${t.name}!`, { id: toastId });
      setLoadingId(null);
    }, 2000);
  }

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <Breadcrumb items={[{ label: 'Membership' }]} className="justify-center mb-6" />
        <SectionHeading
          eyebrow="Professional Membership"
          title="Elevate your beauty business"
          sub="Choose the tier that matches your order volume. Every tier includes trade pricing on the full catalogue. Higher tiers add priority logistics, team seats and dedicated support."
          align="center"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-center">
        {membershipTiers.map((t) => (
          <div
            key={t.id}
            className={`relative rounded-[2rem] border p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
              t.featured 
                ? 'border-gold/50 bg-gradient-to-b from-ink via-[#2a3441] to-ink text-porcelain shadow-xl shadow-gold/20 lg:scale-105 lg:-translate-y-4 z-10' 
                : 'border-pink-200/60 bg-white/60 backdrop-blur-xl shadow-card hover:bg-white/90'
            }`}
          >
            {t.featured && (
              <>
                <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-b from-gold to-gold-dark opacity-30 blur-[2px] -z-10" />
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-light to-gold px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink shadow-lg shadow-gold/30">
                  Most Chosen
                </span>
              </>
            )}
            
            <div className="text-center mb-8">
              <p className={`font-mono text-[12px] font-bold uppercase tracking-widest2 ${t.featured ? 'text-gold-light' : 'text-gold-dark'}`}>{t.name}</p>
              <div className="mt-4 flex items-end justify-center gap-1">
                <p className={`font-display text-5xl leading-none tracking-tight ${t.featured ? 'text-porcelain drop-shadow-sm' : 'text-ink'}`}>
                  {t.price === 0 ? 'Free' : `₹${t.price.toLocaleString('en-IN')}`}
                </p>
                {t.price > 0 && <span className={`mb-1 text-sm ${t.featured ? 'text-porcelain/60' : 'text-ink/60'}`}>/ {t.period}</span>}
              </div>
            </div>

            <div className={`h-px w-full mb-8 ${t.featured ? 'bg-gradient-to-r from-transparent via-line/20 to-transparent' : 'bg-gradient-to-r from-transparent via-pink-200 to-transparent'}`} />

            <ul className="space-y-4">
              {t.perks.map((p) => (
                <li key={p} className={`flex items-start gap-3 text-sm leading-relaxed ${t.featured ? 'text-porcelain/85' : 'text-ink/75'}`}>
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${t.featured ? 'bg-gold/20 text-gold-light' : 'bg-pink-100 text-gold-dark'}`}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleUpgrade(t)}
              disabled={loadingId === t.id}
              className={`mt-10 w-full rounded-full py-4 text-[15px] font-semibold transition-all duration-300 active:scale-[0.98] ${
                t.featured 
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-white shadow-lg shadow-gold/30 hover:from-gold-light hover:to-gold' 
                  : 'bg-white text-ink border border-pink-200 hover:bg-pink-50 hover:border-pink-300 shadow-sm'
              }`}
            >
              {loadingId === t.id ? 'Processing...' : (t.price === 0 ? 'Current plan' : `Upgrade to ${t.name}`)}
            </button>
          </div>
        ))}
      </div>
    </Container>
  )
}
