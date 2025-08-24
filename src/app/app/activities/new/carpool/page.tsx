'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CustomDropdown } from '@/components/ui/custom-dropdown'
import {
  ArrowLeft,
  Plus,
  Upload,
  X,
  Info,
  Calendar,
  MapPin,
  Users,
  Car,
  Eye,
  Share2,
  Download,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'

interface Activity {
  id: string
  type: 'carpool'
  status: 'draft' | 'active' | 'closed'
  name: string
  branch?: string
  startDate: string
  endDate: string
  city: string
  place: string
  lat?: number
  lng?: number
  organizerEmail: string
  distance: number
  passengers: number
  trips: number
  fuelSaved: number
  photos: string[]
  tickets: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

const branches = ['Marketing', 'Engineering', 'Sales', 'HR', 'Other']

export default function CarpoolPage() {
  const router = useRouter()
  const [activity, setActivity] = useState<Activity>({
    id: 'new',
    type: 'carpool',
    status: 'draft',
    name: '',
    branch: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    city: '',
    place: '',
    lat: undefined,
    lng: undefined,
    organizerEmail: 'organizer@example.com',
    distance: 0,
    passengers: 1,
    trips: 1,
    fuelSaved: 0,
    photos: [],
    tickets: [],
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [isLoading, setIsLoading] = useState(false)

  // Calculate CO₂e avoided
  const calculateCO2e = () => {
    // Factor for carpool (example: 0.2 kg CO₂e per km per passenger)
    const totalPassengerKm = activity.distance * activity.passengers * activity.trips
    return totalPassengerKm * 0.2
  }

  const co2eAvoided = calculateCO2e()

  // Validation
  const canStart = activity.name && activity.startDate && activity.endDate && activity.city && activity.place
  const canClose = activity.distance > 0 && activity.passengers >= 1 && activity.trips >= 1 && activity.photos.length >= 2

  const handleSave = () => {
    // Auto-save logic would go here
    console.log('Saving draft...', activity)
  }

  const handleStart = () => {
    if (canStart) {
      setActivity(prev => ({ ...prev, status: 'active' }))
    }
  }

  const handleClose = () => {
    if (canClose) {
      setActivity(prev => ({ ...prev, status: 'closed' }))
      // Redirect to receipt
      router.push(`/r/${activity.id}`)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPhotos = files.map(file => URL.createObjectURL(file))
    setActivity(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }))
  }

  const removePhoto = (index: number) => {
    setActivity(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))
  }

  return (
    <div className="min-h-dvh bg-white">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Form */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-zinc-800">
                    <ArrowLeft className="w-4 h-4" />
                    Activities
                  </button>
                  <span>/</span>
                  <span>Carpool day</span>
                </div>
                <h1 className="text-[32px] leading-[40px] font-semibold text-zinc-900">Carpool day</h1>
                <p className="text-[14px] leading-[20px] text-zinc-600">
                  Track shared rides — see how much CO₂ you avoided.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="h-10 rounded-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  New activity
                </Button>
                <Button variant="outline" size="sm" className="h-10 rounded-lg">
                  <Upload className="w-4 h-4 mr-2" />
                  Import evidence (ZIP)
                </Button>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <Badge 
                variant={activity.status === 'draft' ? 'secondary' : activity.status === 'active' ? 'default' : 'default'}
                className={activity.status === 'draft' ? 'bg-zinc-100 text-zinc-700' : 
                          activity.status === 'active' ? 'bg-indigo-50 text-indigo-700' : 
                          'bg-emerald-50 text-emerald-700'}
              >
                {activity.status === 'draft' ? 'Draft' : 
                 activity.status === 'active' ? 'Active' : 'Closed'}
              </Badge>
              <span className="text-[12px] leading-[16px] text-zinc-500">
                Last saved {format(new Date(activity.updatedAt), 'HH:mm')}
              </span>
            </div>

            {/* Basics Section */}
            <div className="space-y-6">
              <h2 className="text-[20px] leading-[28px] font-semibold text-zinc-900">Basics</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Activity name *
                  </Label>
                  <Input
                    id="name"
                    value={activity.name}
                    onChange={(e) => setActivity(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Team carpool to office"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                      Start date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={activity.startDate}
                      onChange={(e) => setActivity(prev => ({ ...prev, startDate: e.target.value }))}
                      className="mt-2 h-11 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                      End date *
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={activity.endDate}
                      onChange={(e) => setActivity(prev => ({ ...prev, endDate: e.target.value }))}
                      className="mt-2 h-11 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Location *
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={activity.city}
                      onChange={(e) => setActivity(prev => ({ ...prev, city: e.target.value }))}
                      className="h-11 rounded-lg"
                    />
                    <Input
                      placeholder="Place"
                      value={activity.place}
                      onChange={(e) => setActivity(prev => ({ ...prev, place: e.target.value }))}
                      className="h-11 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      step="0.000001"
                      placeholder="Latitude"
                      value={activity.lat || ''}
                      onChange={(e) => setActivity(prev => ({ ...prev, lat: e.target.value ? parseFloat(e.target.value) : undefined }))}
                      className="h-11 rounded-lg"
                    />
                    <Input
                      type="number"
                      step="0.000001"
                      placeholder="Longitude"
                      value={activity.lng || ''}
                      onChange={(e) => setActivity(prev => ({ ...prev, lng: e.target.value ? parseFloat(e.target.value) : undefined }))}
                      className="h-11 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Organizer email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={activity.organizerEmail}
                    onChange={(e) => setActivity(prev => ({ ...prev, organizerEmail: e.target.value }))}
                    className="mt-2 h-11 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <h2 className="text-[20px] leading-[28px] font-semibold text-zinc-900">Output</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="distance" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                      Distance, km *
                    </Label>
                    <Input
                      id="distance"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={activity.distance || ''}
                      onChange={(e) => setActivity(prev => ({ ...prev, distance: parseFloat(e.target.value) || 0 }))}
                      className="mt-2 h-11 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passengers" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                      Passengers *
                    </Label>
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      value={activity.passengers}
                      onChange={(e) => setActivity(prev => ({ ...prev, passengers: parseInt(e.target.value) || 1 }))}
                      className="mt-2 h-11 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trips" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                      Number of trips *
                    </Label>
                    <Input
                      id="trips"
                      type="number"
                      min="1"
                      value={activity.trips}
                      onChange={(e) => setActivity(prev => ({ ...prev, trips: parseInt(e.target.value) || 1 }))}
                      className="mt-2 h-11 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuelSaved" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                      Fuel saved, L
                    </Label>
                    <Input
                      id="fuelSaved"
                      type="number"
                      step="0.1"
                      min="0"
                      value={activity.fuelSaved || ''}
                      onChange={(e) => setActivity(prev => ({ ...prev, fuelSaved: parseFloat(e.target.value) || 0 }))}
                      className="mt-2 h-11 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Section */}
            <div className="space-y-6">
              <h2 className="text-[20px] leading-[28px] font-semibold text-zinc-900">Evidence</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Photos * (minimum 2)
                  </Label>
                  <div className="mt-2 border-2 border-dashed border-zinc-200 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                      <p className="text-[14px] leading-[20px] text-zinc-600">Drop photos here or click to upload</p>
                    </label>
                  </div>
                  
                  {activity.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {activity.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                    Notes
                  </Label>
                  <textarea
                    id="notes"
                    value={activity.notes}
                    onChange={(e) => setActivity(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional details about the carpool..."
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-[14px] leading-[20px] text-zinc-900"
                  />
                </div>
              </div>
            </div>

            {/* Integrity & Method Section */}
            <div className="space-y-6">
              <h2 className="text-[20px] leading-[28px] font-semibold text-zinc-900">Integrity & method</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-zinc-500" />
                    <span className="text-[14px] leading-[20px] text-zinc-600">Double-count check</span>
                  </div>
                  <Badge variant="secondary" className="bg-zinc-100 text-zinc-700">
                    {activity.status === 'draft' ? 'Not run' : 'OK'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-zinc-500" />
                    <span className="text-[14px] leading-[20px] text-zinc-600">Factor set</span>
                  </div>
                  <span className="text-[14px] leading-[20px] text-zinc-600">v2025.1</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-zinc-500" />
                    <span className="text-[14px] leading-[20px] text-zinc-600">Scope & method</span>
                  </div>
                  <span className="text-[14px] leading-[20px] text-zinc-600">Carpool C3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Result Preview */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6">
                <h3 className="text-[16px] leading-[24px] font-semibold text-zinc-900 mb-4">Result preview</h3>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-zinc-900 mb-1">
                    {co2eAvoided.toFixed(1)} kg CO₂e
                  </div>
                  <div className="text-[14px] leading-[20px] text-zinc-600">avoided</div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">~km not driven</span>
                    <span className="text-zinc-900">{(co2eAvoided * 4).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">~liters fuel saved</span>
                    <span className="text-zinc-900">{(co2eAvoided * 0.4).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">~kWh grid power</span>
                    <span className="text-zinc-900">{(co2eAvoided * 0.8).toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-[12px] leading-[16px] text-zinc-500 mb-4">
                  Rough, region-based conversions; all values mean avoided impact.
                </p>

                <Button variant="outline" className="w-full h-10 rounded-lg">
                  Region & factors
                </Button>
              </div>

              {/* Quality & Approvals */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6">
                <h3 className="text-[16px] leading-[24px] font-semibold text-zinc-900 mb-4">Quality & approvals</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-[14px] leading-[20px] font-medium text-zinc-900">Confidence</Label>
                    <div className="mt-2 p-3 bg-zinc-50 rounded-lg">
                      <span className="text-[14px] leading-[20px] text-zinc-600">Standard ×1.0</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[14px] leading-[20px] font-medium text-zinc-900">Approvals</Label>
                    <div className="mt-2 p-3 bg-zinc-50 rounded-lg">
                      <span className="text-[14px] leading-[20px] text-zinc-600">0/2</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6">
                <h3 className="text-[16px] leading-[24px] font-semibold text-zinc-900 mb-4">Actions</h3>
                
                <div className="space-y-3">
                  {activity.status === 'draft' && (
                    <>
                      <Button 
                        onClick={handleSave}
                        variant="outline" 
                        className="w-full h-10 rounded-lg"
                      >
                        Save draft
                      </Button>
                      <Button 
                        onClick={handleStart}
                        disabled={!canStart}
                        className="w-full h-10 rounded-lg"
                      >
                        Start activity
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-10 rounded-lg"
                      >
                        Invite...
                      </Button>
                      <Button 
                        onClick={handleClose}
                        disabled={!canClose}
                        variant="outline" 
                        className="w-full h-10 rounded-lg"
                        title={!canClose ? "Need: distance >0, passengers ≥1, trips ≥1, photos ≥2" : undefined}
                      >
                        Close activity → Generate receipt
                      </Button>
                    </>
                  )}

                  {activity.status === 'active' && (
                    <>
                      <Button 
                        onClick={handleSave}
                        variant="outline" 
                        className="w-full h-10 rounded-lg"
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-10 rounded-lg"
                      >
                        Invite...
                      </Button>
                      <Button 
                        onClick={handleClose}
                        disabled={!canClose}
                        className="w-full h-10 rounded-lg"
                        title={!canClose ? "Need: distance >0, passengers ≥1, trips ≥1, photos ≥2" : undefined}
                      >
                        Close activity → Generate receipt
                      </Button>
                    </>
                  )}

                  {activity.status === 'closed' && (
                    <>
                      <Button 
                        onClick={() => router.push(`/r/${activity.id}`)}
                        className="w-full h-10 rounded-lg"
                      >
                        View receipt
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-10 rounded-lg"
                      >
                        Share link
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-10 rounded-lg"
                      >
                        Download EPK
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
