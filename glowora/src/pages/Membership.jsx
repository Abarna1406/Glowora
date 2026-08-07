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
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Membership' }]} />
      <SectionHeading
        eyebrow="Professional Membership"
        title="Choose the tier that matches your order volume"
        sub="Every tier includes trade pricing on the full catalogue. Higher tiers add priority logistics, team seats and dedicated support."
        align="center"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {membershipTiers.map((t) => (
          <div
            key={t.id}
            className={`relative rounded-xl2 border p-8 ${t.featured ? 'border-gold bg-ink text-porcelain shadow-soft lg:-translate-y-4' : 'border-line bg-white'}`}
          >
            {t.featured && <span className="absolute -top-3 left-8 rounded-full bg-gold px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-ink">Most Chosen</span>}
            <p className={`font-mono text-[11px] uppercase tracking-widest2 ${t.featured ? 'text-gold-light' : 'text-gold-dark'}`}>{t.name}</p>
            <p className={`mt-3 font-display text-3xl ${t.featured ? 'text-porcelain' : 'text-ink'}`}>
              {t.price === 0 ? 'Free' : `₹${t.price.toLocaleString('en-IN')}`}
            </p>
            <p className={`mt-1 text-xs ${t.featured ? 'text-porcelain/55' : 'text-ink/50'}`}>{t.period}</p>
            <ul className="mt-6 space-y-3">
              {t.perks.map((p) => (
                <li key={p} className={`flex items-start gap-2 text-sm ${t.featured ? 'text-porcelain/80' : 'text-ink/65'}`}>
                  <Check size={15} className={`mt-0.5 shrink-0 ${t.featured ? 'text-gold-light' : 'text-gold-dark'}`} /> {p}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleUpgrade(t)}
              disabled={loadingId === t.id}
              className={`mt-8 w-full ${t.featured ? 'btn-primary !bg-gold !text-ink hover:!bg-gold-light' : 'btn-secondary'}`}
            >
              {loadingId === t.id ? 'Processing...' : (t.price === 0 ? 'Current plan' : `Upgrade to ${t.name}`)}
            </button>
          </div>
        ))}
      </div>
    </Container>
  )
}
