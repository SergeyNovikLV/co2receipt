'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { FileText, ClipboardList, Users, TrendingUp, Clock } from 'lucide-react'

export default function DashboardPage() {
  const [stats] = useState({
    receiptsTotal: 0,
    activeActivities: 0,
    branchesActive: 0,
    co2eAvoided: 0,
    thisMonth: {
      verified: 0,
      pending: 0,
      co2e: 0
    },
    queue: [] as Array<{ id: number|string; title: string; status: string; date: string }>,
    recentReceipts: [] as Array<{ id: number|string; name: string; status: 'verified'|'pending'; co2e: number; issued: string }>
  })

  type StatCardProps = { icon: any; title: string; value: number | string | null; unit?: string; loading?: boolean }
  const StatCard = ({ icon: Icon, title, value, unit = '' }: StatCardProps) => (
    <Card className="p-4 md:p-5 border border-zinc-200 rounded-2xl hover:border-zinc-300 min-h-[120px]">
      <Icon className="w-5 h-5 text-zinc-500" />
      <div className="mt-2">
        <div className="text-sm text-zinc-500">{title}</div>
        <div className="flex items-baseline gap-1 mt-2 min-h-[48px]">
          <div className="text-3xl font-semibold text-zinc-900">{value ?? 0}</div>
          {unit && <div className="text-sm text-zinc-500">{unit}</div>}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pt-6">
        <h1 className="text-[32px] leading-[40px] font-semibold text-zinc-900">Dashboard</h1>
        <p className="text-[14px] leading-[20px] text-zinc-600 mt-2">Overview of your organization&apos;s environmental impact</p>
      </div>

      {/* Top Stats - 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FileText} title="Receipts — total" value={stats.receiptsTotal} />
        <StatCard 
          icon={ClipboardList} 
          title="Active activities" 
          value={stats.activeActivities} 
        />
        <StatCard 
          icon={Users} 
          title="Branches active" 
          value={stats.branchesActive} 
        />
        <StatCard 
          icon={TrendingUp} 
          title="CO₂e avoided — total" 
          value={stats.co2eAvoided} 
          unit="kg CO₂e"
        />
      </div>

      {/* Second Row - This Month & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* This Month */}
        <Card className="p-5 border border-zinc-200 rounded-2xl h-full">
          <h2 className="text-[20px] leading-[28px] font-semibold text-zinc-900 mb-2">This month</h2>
          <div className="text-3xl font-semibold text-zinc-900">{stats.thisMonth.verified}</div>
          <div className="text-xs text-zinc-500 mt-1">Verified this month</div>
        </Card>

        {/* Your Queue */}
        <Card className="p-5 border border-zinc-200 rounded-2xl h-full">
          <h2 className="text-[20px] leading-[28px] font-semibold text-zinc-900 mb-2">Your queue</h2>
          {stats.queue.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="w-5 h-5 text-zinc-400 mx-auto mb-3" />
              <h4 className="text-[14px] leading-[20px] font-medium text-zinc-900 mb-1">No tasks yet</h4>
              <p className="text-[12px] leading-[16px] text-zinc-600">New tasks will appear here when activities need action.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.queue.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                  <div className="text-sm text-zinc-900 truncate">{task.title}</div>
                  <div className="text-xs text-zinc-500 ml-3 whitespace-nowrap">{task.date}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Third Row - Recent Receipts */}
      <Card className="p-5 border border-zinc-200 rounded-2xl">
        <h2 className="text-[20px] leading-[28px] font-semibold text-zinc-900 mb-2">Recent receipts</h2>
        {stats.recentReceipts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-5 h-5 text-zinc-400 mx-auto mb-3" />
            <h4 className="text-[14px] leading-[20px] font-medium text-zinc-900 mb-2">Nothing here yet</h4>
            <p className="text-[12px] leading-[16px] text-zinc-600">
              New receipts will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left text-[12px] leading-[16px] font-medium text-zinc-500 py-3">Name</th>
                  <th className="text-left text-[12px] leading-[16px] font-medium text-zinc-500 py-3">Status</th>
                  <th className="text-left text-[12px] leading-[16px] font-medium text-zinc-500 py-3">CO₂e</th>
                  <th className="text-left text-[12px] leading-[16px] font-medium text-zinc-500 py-3">Issued</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentReceipts.map((receipt: { id: number|string; name: string; status: 'verified'|'pending'; co2e: number; issued: string }) => (
                  <tr key={receipt.id} className="border-b border-zinc-100">
                    <td className="py-3">
                      <div className="text-[14px] leading-[20px] font-medium text-zinc-900">
                        {receipt.name}
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge 
                        variant={receipt.status === 'verified' ? 'default' : 'secondary'}
                        className={receipt.status === 'verified' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      >
                        {receipt.status === 'verified' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {receipt.status === 'verified' ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="text-[14px] leading-[20px] text-zinc-900">
                        {receipt.co2e} kg CO₂e
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="text-[14px] leading-[20px] text-zinc-600">
                        {receipt.issued}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
