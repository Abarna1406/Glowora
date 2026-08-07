import React from 'react'
import { Moon, Sun, Bell, Lock, Users } from 'lucide-react'
import { Container } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { useStore } from '../lib/store.jsx'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition ${checked ? 'bg-ink' : 'bg-line'}`}
    >
      <span className={`h-5 w-5 rounded-full bg-porcelain shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  )
}

export default function Settings() {
  const { dark, setDark } = useStore()
  const [emailNotif, setEmailNotif] = React.useState(true)
  const [smsNotif, setSmsNotif] = React.useState(false)
  const [priceAlerts, setPriceAlerts] = React.useState(true)

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Settings' }]} />
      <h1 className="font-display text-3xl text-ink md:text-4xl">Settings</h1>

      <div className="mt-8 space-y-4">
        <div className="rounded-xl2 border border-line bg-white p-6">
          <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">
            {dark ? <Moon size={13} /> : <Sun size={13} />} Appearance
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink">Dark mode</p>
              <p className="mt-0.5 text-xs text-ink/50">Switch the storefront to a low-light theme</p>
            </div>
            <Toggle checked={dark} onChange={setDark} />
          </div>
        </div>

        <div className="rounded-xl2 border border-line bg-white p-6">
          <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-ink/40"><Bell size={13} /> Notifications</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><p className="text-sm text-ink">Email updates on orders</p><Toggle checked={emailNotif} onChange={setEmailNotif} /></div>
            <div className="flex items-center justify-between"><p className="text-sm text-ink">SMS delivery alerts</p><Toggle checked={smsNotif} onChange={setSmsNotif} /></div>
            <div className="flex items-center justify-between"><p className="text-sm text-ink">Price drop alerts on wishlist items</p><Toggle checked={priceAlerts} onChange={setPriceAlerts} /></div>
          </div>
        </div>

        <div className="rounded-xl2 border border-line bg-white p-6">
          <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-ink/40"><Lock size={13} /> Security</p>
          <button className="btn-secondary">Change password</button>
        </div>

        <div className="rounded-xl2 border border-line bg-white p-6">
          <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-ink/40"><Users size={13} /> Team seats</p>
          <p className="text-sm text-ink/55">Gold membership includes 3 seats. 1 of 3 currently in use.</p>
          <button className="btn-ghost mt-2 !px-0">Invite a team member</button>
        </div>
      </div>
    </Container>
  )
}
