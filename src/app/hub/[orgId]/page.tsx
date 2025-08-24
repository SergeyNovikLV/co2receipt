export default function HubPage({ params }: any) {
  const orgId = params.orgId
  return (
    <div className="max-w-[1000px] mx-auto px-8 md:px-10 py-10 space-y-6">
      <h1 className="text-[32px] leading-[40px] font-semibold text-zinc-900">Organizer Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-zinc-200 rounded-2xl p-5"><div className="text-sm text-zinc-600 mb-1">CO₂e avoided — total</div><div className="text-3xl font-semibold">0</div></div>
        <div className="border border-zinc-200 rounded-2xl p-5"><div className="text-sm text-zinc-600 mb-1">This month — Verified</div><div className="text-3xl font-semibold">0</div></div>
        <div className="border border-zinc-200 rounded-2xl p-5"><div className="text-sm text-zinc-600 mb-1">Active activities</div><div className="text-3xl font-semibold">0</div></div>
      </div>
      <div className="border border-zinc-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-200 text-sm font-medium">Activities</div>
        <div className="p-6 text-sm text-zinc-600">No activities yet</div>
      </div>
    </div>
  )
}


