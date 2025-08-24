'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CustomDropdown } from '@/components/ui/custom-dropdown'
import { DateInput } from '@/components/ui/date-input'
import { 
  ArrowLeft,
  Leaf,
  Camera,
  FileText,
  Users,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const branches = ['Marketing', 'Engineering', 'Sales', 'HR', 'Other']

export default function CleanupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0) // 0: subtype selection, 1: form
  const [activity, setActivity] = useState({
    name: 'Community clean-up',
    subtype: 'outdoor-litter', // Default subtype
    branch: '',
    startDate: '',
    endDate: '',
    city: '',
    place: '',
    lat: '',
    lng: '',
    organizerEmail: 'organizer@example.com',
    participants: 1,
    photos: [],
    tickets: [],
    notes: '',
    hasWeighTickets: false,
    // Dynamic fields based on subtype
    wasteFractions: {
      mixed: 0,
      plastic: 0,
      glass: 0,
      metal: 0,
      paperCardboard: 0
    },
    eWaste: {
      totalKg: 0,
      categories: []
    },
    archive: {
      cardboard: 0,
      filmPlastic: 0,
      mixed: 0,
      boxesCount: 0
    },
    textile: {
      totalKg: 0
    },
    batteries: {
      items: 0,
      totalKg: 0
    },
    deposit: {
      bottles: 0,
      cans: 0,
      slips: 0
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/activities/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'cleanup' }),
      })
      
      if (response.ok) {
        // Redirect back to activities page after creation
        router.push('/app?tab=activities')
      } else {
        console.error('Failed to create activity')
      }
    } catch (error) {
      console.error('Error creating activity:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 px-3 hover:bg-zinc-100"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={20} className="text-zinc-600 mr-2" />
          Back
        </Button>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Clean-up Activity</h1>
        <p className="text-zinc-600">Create a new clean-up activity</p>
      </div>

      {step === 0 ? (
        // Step 0: Subtype Selection
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-6">Select Clean-up Type</h2>
          <div className="space-y-4">
            {[
              {
                id: 'outdoor-litter',
                title: 'Outdoor litter',
                description: 'Street, park, beach, or public area cleanup',
                icon: '🌳'
              },
              {
                id: 'e-waste',
                title: 'E-waste',
                description: 'Electronics, computers, phones, appliances',
                icon: '💻'
              },
              {
                id: 'archive',
                title: 'Archive / Storeroom purge',
                description: 'Office cleanup, document shredding, storage organization',
                icon: '📁'
              },
              {
                id: 'textile',
                title: 'Textile / Footwear',
                description: 'Clothing, shoes, fabric waste collection',
                icon: '👕'
              },
              {
                id: 'batteries',
                title: 'Batteries / Lamps',
                description: 'Battery collection, light bulb recycling',
                icon: '🔋'
              },
              {
                id: 'deposit',
                title: 'Deposit return',
                description: 'Bottles, cans, returnable containers',
                icon: '🥤'
              }
            ].map((subtype) => (
              <button
                key={subtype.id}
                type="button"
                onClick={() => {
                  setActivity(prev => ({ ...prev, subtype: subtype.id }))
                  setStep(1)
                }}
                className={`w-full p-4 text-left border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  activity.subtype === subtype.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{subtype.icon}</span>
                  <div>
                    <h3 className="text-[16px] leading-[24px] font-semibold text-zinc-900">
                      {subtype.title}
                    </h3>
                    <p className="text-[14px] leading-[20px] text-zinc-600">
                      {subtype.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      ) : (
        // Step 1: Main Form
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900">Basic Information</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(0)}
                className="text-zinc-600 hover:text-zinc-800"
              >
                Change type
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                  Activity name *
                </Label>
                <Input
                  id="name"
                  value={activity.name}
                  onChange={(e) => setActivity(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Park cleanup event"
                  className="mt-2 h-11 rounded-lg"
                />
              </div>

              <CustomDropdown
                label="Branch / Team"
                options={[
                  { value: '', label: 'Select branch' },
                  ...branches.map(branch => ({ value: branch, label: branch }))
                ]}
                value={activity.branch}
                onChange={(value) => setActivity(prev => ({ ...prev, branch: value }))}
                placeholder="Select branch"
              />
            </div>
          </Card>

        {/* When & Where */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">When & Where</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateInput
              label="Start date *"
              value={activity.startDate}
              onChange={(e) => setActivity(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
            
            <DateInput
              label="End date *"
              value={activity.endDate}
              onChange={(e) => setActivity(prev => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="city" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                City *
              </Label>
              <Input
                id="city"
                value={activity.city}
                onChange={(e) => setActivity(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g., Riga"
                className="mt-2 h-11 rounded-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="place" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                Place *
              </Label>
              <Input
                id="place"
                value={activity.place}
                onChange={(e) => setActivity(prev => ({ ...prev, place: e.target.value }))}
                placeholder="e.g., Mežaparks"
                className="mt-2 h-11 rounded-lg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="lat" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                Latitude
              </Label>
              <Input
                id="lat"
                type="number"
                step="0.000001"
                value={activity.lat}
                onChange={(e) => setActivity(prev => ({ ...prev, lat: e.target.value }))}
                placeholder="e.g., 56.9496"
                className="mt-2 h-11 rounded-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="lng" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                Longitude
              </Label>
              <Input
                id="lng"
                type="number"
                step="0.000001"
                value={activity.lng}
                onChange={(e) => setActivity(prev => ({ ...prev, lng: e.target.value }))}
                placeholder="e.g., 24.1052"
                className="mt-2 h-11 rounded-lg"
              />
            </div>
          </div>
        </Card>

        {/* Dynamic Waste Collection by Subtype */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Waste Collection Details</h2>
          
          {/* Outdoor Litter */}
          {activity.subtype === 'outdoor-litter' && (
            <div className="space-y-4">
              <h3 className="text-[16px] leading-[24px] font-medium text-zinc-900">Fractions & Weight (kg)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mixed" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Mixed waste
                  </Label>
                  <Input
                    id="mixed"
                    type="number"
                    step="0.1"
                    value={activity.wasteFractions.mixed}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      wasteFractions: { ...prev.wasteFractions, mixed: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="0.0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="plastic" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Plastic
                  </Label>
                  <Input
                    id="plastic"
                    type="number"
                    step="0.1"
                    value={activity.wasteFractions.plastic}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      wasteFractions: { ...prev.wasteFractions, plastic: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="0.0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="glass" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Glass
                  </Label>
                  <Input
                    id="glass"
                    type="number"
                    step="0.1"
                    value={activity.wasteFractions.glass}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      wasteFractions: { ...prev.wasteFractions, glass: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="0.0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="metal" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Metal
                  </Label>
                  <Input
                    id="metal"
                    type="number"
                    step="0.1"
                    value={activity.wasteFractions.metal}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      wasteFractions: { ...prev.wasteFractions, metal: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="0.0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="paperCardboard" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Paper & Cardboard
                  </Label>
                  <Input
                    id="paperCardboard"
                    type="number"
                    step="0.1"
                    value={activity.wasteFractions.paperCardboard}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      wasteFractions: { ...prev.wasteFractions, paperCardboard: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="0.0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* E-waste */}
          {activity.subtype === 'e-waste' && (
            <div className="space-y-4">
              <h3 className="text-[16px] leading-[24px] font-medium text-zinc-900">E-waste Collection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eWasteTotal" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Total weight (kg) *
                  </Label>
                  <Input
                    id="eWasteTotal"
                    type="number"
                    step="0.1"
                    value={activity.eWaste.totalKg}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      eWaste: { ...prev.eWaste, totalKg: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="0.0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Archive/Storeroom */}
          {activity.subtype === 'archive' && (
            <div className="space-y-4">
              <h3 className="text-[16px] leading-[24px] font-medium text-zinc-900">Archive Cleanup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardboard" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Cardboard (kg)
                  </Label>
                  <Input
                    id="cardboard"
                    type="number"
                    step="0.1"
                    value={activity.archive.cardboard}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      archive: { ...prev.archive, cardboard: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="0.0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="filmPlastic" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Film/Plastic (kg)
                  </Label>
                  <Input
                    id="filmPlastic"
                    type="number"
                    step="0.1"
                    value={activity.archive.filmPlastic}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      archive: { ...prev.archive, filmPlastic: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="0.0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="mixedArchive" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Mixed (kg)
                  </Label>
                  <Input
                    id="mixedArchive"
                    type="number"
                    step="0.1"
                    value={activity.archive.mixed}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      archive: { ...prev.archive, mixed: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="0.0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="boxesCount" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Boxes count (optional)
                  </Label>
                  <Input
                    id="boxesCount"
                    type="number"
                    value={activity.archive.boxesCount}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      archive: { ...prev.archive, boxesCount: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Textile/Footwear */}
          {activity.subtype === 'textile' && (
            <div className="space-y-4">
              <h3 className="text-[16px] leading-[24px] font-medium text-zinc-900">Textile Collection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="textileTotal" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Total weight (kg) *
                  </Label>
                  <Input
                    id="textileTotal"
                    type="number"
                    step="0.1"
                    value={activity.textile.totalKg}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      textile: { ...prev.textile, totalKg: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="0.0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Batteries/Lamps */}
          {activity.subtype === 'batteries' && (
            <div className="space-y-4">
              <h3 className="text-[16px] leading-[24px] font-medium text-zinc-900">Batteries & Lamps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batteriesItems" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Items count
                  </Label>
                  <Input
                    id="batteriesItems"
                    type="number"
                    value={activity.batteries.items}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      batteries: { ...prev.batteries, items: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="batteriesTotal" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Total weight (kg)
                  </Label>
                  <Input
                    id="batteriesTotal"
                    type="number"
                    step="0.1"
                    value={activity.batteries.totalKg}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      batteries: { ...prev.batteries, totalKg: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="0.0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Deposit Return */}
          {activity.subtype === 'deposit' && (
            <div className="space-y-4">
              <h3 className="text-[16px] leading-[24px] font-medium text-zinc-900">Deposit Return</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bottles" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Bottles count
                  </Label>
                  <Input
                    id="bottles"
                    type="number"
                    value={activity.deposit.bottles}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      deposit: { ...prev.deposit, bottles: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="cans" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Cans count
                  </Label>
                  <Input
                    id="cans"
                    type="number"
                    value={activity.deposit.cans}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      deposit: { ...prev.deposit, cans: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="slips" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Return slips
                  </Label>
                  <Input
                    id="slips"
                    type="number"
                    value={activity.deposit.slips}
                    onChange={(e) => setActivity(prev => ({ 
                      ...prev, 
                      deposit: { ...prev.deposit, slips: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="0"
                    min="0"
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Evidence Quality */}
          <div className="mt-6 pt-4 border-t border-zinc-200">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={activity.hasWeighTickets}
                  onChange={(e) => setActivity(prev => ({ ...prev, hasWeighTickets: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 border-zinc-300 rounded focus:ring-indigo-500"
                />
                <span className="text-[14px] leading-[20px] font-medium text-zinc-900">
                  Weigh tickets/waybill provided
                </span>
              </label>
            </div>
            <p className="text-[12px] leading-[16px] text-zinc-500 mt-1">
              {activity.hasWeighTickets ? 'Weighed ×1.2' : 'Standard ×1.0'} — Data quality indicator
            </p>
          </div>
        </Card>

        {/* Team */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="participants" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                Number of participants *
              </Label>
              <Input
                id="participants"
                type="number"
                value={activity.participants}
                onChange={(e) => setActivity(prev => ({ ...prev, participants: parseInt(e.target.value) || 1 }))}
                placeholder="1"
                min="1"
                className="mt-2 h-11 rounded-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="organizerEmail" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                Organizer email *
              </Label>
              <Input
                id="organizerEmail"
                type="email"
                value={activity.organizerEmail}
                onChange={(e) => setActivity(prev => ({ ...prev, organizerEmail: e.target.value }))}
                placeholder="organizer@example.com"
                className="mt-2 h-11 rounded-lg"
              />
            </div>
          </div>
        </Card>

        {/* Evidence */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Evidence</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border-2 border-dashed border-zinc-300 rounded-lg">
              <Camera className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-600">Photos</p>
              <p className="text-xs text-zinc-500">Upload evidence</p>
            </div>
            
            <div className="text-center p-4 border-2 border-dashed border-zinc-300 rounded-lg">
              <FileText className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-600">Tickets</p>
              <p className="text-xs text-zinc-500">Weigh tickets</p>
            </div>
            
            <div className="text-center p-4 border-2 border-dashed border-zinc-300 rounded-lg">
              <Users className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-600">Team</p>
              <p className="text-xs text-zinc-500">Group photo</p>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? 'Creating...' : 'Create Activity'}
          </Button>
        </div>
      </form>
      )}
    </div>
  )
}
