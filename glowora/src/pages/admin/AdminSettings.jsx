import React from 'react'

export default function AdminSettings() {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Platform settings</h2>
      <p className="mt-1 text-sm text-ink/50">Store-wide configuration for Glowora</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl2 border border-line bg-white p-6">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Store details</p>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/60">Store name</label>
              <input defaultValue="Glowora" className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/60">Support email</label>
              <input defaultValue="hello@glowora.com" className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/60">Default shipping threshold (free above)</label>
              <input defaultValue="₹15,000" className="input-field" />
            </div>
          </div>
          <button className="btn-primary mt-6">Save changes</button>
        </div>

        <div className="rounded-xl2 border border-line bg-white p-6">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Verification rules</p>
          <div className="space-y-4 text-sm text-ink/65">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded border-ink/30" /> Require trade licence upload on signup</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded border-ink/30" /> Auto-verify Platinum referrals</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-ink/30" /> Allow individual beautician accounts without GST</label>
          </div>
          <button className="btn-secondary mt-6">Update rules</button>
        </div>
      </div>
    </div>
  )
}
