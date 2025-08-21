'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Fuel,
  Eye,
  Share2,
  Download,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'

type ActivityStatus = 'draft' | 'active' | 'closed'

interface CarpoolActivity {
  id?: string
  name: string
  branch?: string
  startDate: string
  endDate: string
  city: string
  place: string
  latitude: number
  longitude: number
  organizerEmail: string
  distance: number
  passengers: number
  fuelSaved: number
  participants: number
  photos: File[]
  tickets: File[]
  notes: string
  hasWeighTickets: boolean
  status: ActivityStatus
  createdAt: string
  closedAt?: string
}

const BRANCHES = ['Riga Central', 'Riga North', 'Riga South', 'Remote Team']
const FUEL_FACTOR = 2.3 // kg CO2e per liter fuel (mock factor)

export default function CarpoolPage() {
  const router = useRouter()
  const params = useParams()
  const [activity, setActivity] = useState<CarpoolActivity>({
    name: '',
    startDate: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    endDate: format(new Date(Date.now() + 2 * 60 * 60 * 1000), 'yyyy-MM-dd\'T\'HH:mm'),
    city: 'Riga',
    place: '',
    latitude: 56.9496,
    longitude: 24.1052,
    organizerEmail: 'organizer@example.com',
    distance: 0,
    passengers: 1,
    fuelSaved: 0,
    participants: 1,
    photos: [],
    tickets: [],
    notes: '',
    hasWeighTickets: false,
    status: 'draft',
    createdAt: new Date().toISOString()
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [lastSaved, setLastSaved] = useState<Date>(new Date())

  // Calculate CO2e avoided
  const calculateCO2e = () => {
    return (activity.fuelSaved || 0) * FUEL_FACTOR
  }

  const co2eAvoided = calculateCO2e()

  // Human equivalents
  const humanEquivalents = {
    carKm: Math.round(co2eAvoided * 0.4), // km not driven
    fuelLiters: Math.round(co2eAvoided * 0.15), // liters not burned
    electricityKwh: Math.round(co2eAvoided * 0.8), // kWh not consumed
    treeYears: Math.round(co2eAvoided * 0.02) // tree-years equivalent
  }

  // Validation
  const validateBasics = () => {
    const newErrors: Record<string, string> = {}
    if (!activity.name.trim()) newErrors.name = 'Activity name is required'
    if (!activity.startDate) newErrors.startDate = 'Start date is required'
    if (!activity.endDate) newErrors.endDate = 'End date is required'
    if (!activity.city.trim()) newErrors.city = 'City is required'
    if (!activity.place.trim()) newErrors.place = 'Place is required'
    if (!activity.organizerEmail.trim()) newErrors.organizerEmail = 'Organizer email is required'
    return newErrors
  }

  const validateForClose = () => {
    const newErrors: Record<string, string> = {}
    if (!activity.distance || activity.distance < 1) newErrors.distance = 'Distance must be at least 1 km'
    if (!activity.passengers || activity.passengers < 1) newErrors.passengers = 'Passengers must be at least 1'
    if (!activity.fuelSaved || activity.fuelSaved < 0.1) newErrors.fuelSaved = 'Fuel saved must be at least 0.1L'
    if (!activity.participants || activity.participants < 1) newErrors.participants = 'At least 1 participant required'
    if (activity.photos.length < 2) newErrors.photos = 'At least 2 photos required'
    return newErrors
  }

  const canStart = () => {
    const errors = validateBasics()
    return Object.keys(errors).length === 0
  }

  const canClose = () => {
    const errors = validateForClose()
    return Object.keys(errors).length === 0
  }

  // Actions
  const handleStartActivity = () => {
    if (canStart()) {
      setActivity(prev => ({ ...prev, status: 'active' }))
      setLastSaved(new Date())
    }
  }

  const handleCloseActivity = () => {
    if (canClose()) {
      const closedActivity = { 
        ...activity, 
        status: 'closed' as ActivityStatus,
        closedAt: new Date().toISOString()
      }
      setActivity(closedActivity)
      setLastSaved(new Date())
      
      // Generate receipt and redirect
      const slug = `carpool-${Date.now()}`
      router.push(`/r/${slug}`)
    }
  }

  const handleSave = () => {
    setLastSaved(new Date())
    // Save logic would go here
  }

  const handlePhotoUpload = (files: FileList) => {
    const newPhotos = Array.from(files)
    setActivity(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }))
  }

  const handlePhotoRemove = (index: number) => {
    setActivity(prev => ({ 
      ...prev, 
      photos: prev.photos.filter((_, i) => i !== index) 
    }))
  }

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files)
    setActivity(prev => ({ ...prev, tickets: [...prev.tickets, ...newFiles] }))
  }

  const handleFileRemove = (index: number) => {
    setActivity(prev => ({ 
      ...prev, 
      tickets: prev.tickets.filter((_, i) => i !== index) 
    }))
  }

  const getStatusBadge = (status: ActivityStatus) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-zinc-100 text-zinc-700">Draft</Badge>
      case 'active':
        return <Badge className="bg-indigo-600">Active</Badge>
      case 'closed':
        return <Badge className="bg-emerald-600">Closed</Badge>
    }
  }

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case 'draft': return 'text-zinc-500'
      case 'active': return 'text-indigo-600'
      case 'closed': return 'text-emerald-600'
    }
  }

  return (
    <div className="min-h-dvh bg-white">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Form */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-zinc-700">
                  <ArrowLeft className="w-4 h-4" />
                  Activities
                </button>
                <span>/</span>
                <span>Carpool day</span>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-[28px] leading-[34px] font-semibold text-zinc-900">Carpool day</h1>
                  <p className="text-[15px] leading-[22px] text-zinc-600">
                    Organize shared rides and track fuel savings.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusBadge(activity.status)}
                  <span className={`text-sm ${getStatusColor(activity.status)}`}>
                    Last saved {format(lastSaved, 'HH:mm')}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Form Sections */}
            <div className="space-y-8">
              {/* Basics */}
              <div className="space-y-6">
                <h2 className="text-[20px] leading-[24px] font-semibold text-zinc-900">Basics</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Activity name *</Label>
                    <Input
                      id="name"
                      value={activity.name}
                      onChange={(e) => setActivity(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Office carpool to city center"
                      disabled={activity.status === 'closed'}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch / Team</Label>
                    <select
                      id="branch"
                      value={activity.branch}
                      onChange={(e) => setActivity(prev => ({ ...prev, branch: e.target.value }))}
                      className="w-full h-10 px-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      disabled={activity.status === 'closed'}
                    >
                      <option value="">Select branch</option>
                      {BRANCHES.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start date & time *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={activity.startDate}
                      onChange={(e) => setActivity(prev => ({ ...prev, startDate: e.target.value }))}
                      disabled={activity.status === 'closed'}
                    />
                    {errors.startDate && <p className="text-sm text-red-600">{errors.startDate}</p>}
                    <p className="text-xs text-zinc-500">Local timezone</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End date & time *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={activity.endDate}
                      onChange={(e) => setActivity(prev => ({ ...prev, endDate: e.target.value }))}
                      disabled={activity.status === 'closed'}
                    />
                    {errors.endDate && <p className="text-sm text-red-600">{errors.endDate}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={activity.city}
                      onChange={(e) => setActivity(prev => ({ ...prev, city: e.target.value }))}
                      disabled={activity.status === 'closed'}
                    />
                    {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="place">Place *</Label>
                    <Input
                      id="place"
                      value={activity.place}
                      onChange={(e) => setActivity(prev => ({ ...prev, place: e.target.value }))}
                      placeholder="e.g., City center office"
                      disabled={activity.status === 'closed'}
                    />
                    {errors.place && <p className="text-sm text-red-600">{errors.place}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        value={activity.latitude}
                        onChange={(e) => setActivity(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                        disabled={activity.status === 'closed'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        value={activity.longitude}
                        onChange={(e) => setActivity(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                        disabled={activity.status === 'closed'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizerEmail">Organizer email *</Label>
                    <Input
                      id="organizerEmail"
                      type="email"
                      value={activity.organizerEmail}
                      onChange={(e) => setActivity(prev => ({ ...prev, organizerEmail: e.target.value }))}
                      disabled={activity.status === 'closed'}
                    />
                    {errors.organizerEmail && <p className="text-sm text-red-600">{errors.organizerEmail}</p>}
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="space-y-6">
                <h2 className="text-[20px] leading-[24px] font-semibold text-zinc-900">Output — what did you save?</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance, km *</Label>
                    <Input
                      id="distance"
                      type="number"
                      min="1"
                      step="0.1"
                      value={activity.distance}
                      onChange={(e) => setActivity(prev => ({ ...prev, distance: parseFloat(e.target.value) }))}
                      disabled={activity.status === 'closed'}
                    />
                    {errors.distance && <p className="text-sm text-red-600">{errors.distance}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passengers">Passengers *</Label>
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      value={activity.passengers}
                      onChange={(e) => setActivity(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                      disabled={activity.status === 'closed'}
                    />
                    {errors.passengers && <p className="text-sm text-red-600">{errors.passengers}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelSaved">Fuel saved, L *</Label>
                    <Input
                      id="fuelSaved"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={activity.fuelSaved}
                      onChange={(e) => setActivity(prev => ({ ...prev, fuelSaved: parseFloat(e.target.value) }))}
                      disabled={activity.status === 'closed'}
                    />
                    {errors.fuelSaved && <p className="text-sm text-red-600">{errors.fuelSaved}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="participants">Participants *</Label>
                  <Input
                    id="participants"
                    type="number"
                    min="1"
                    value={activity.participants}
                    onChange={(e) => setActivity(prev => ({ ...prev, participants: parseInt(e.target.value) }))}
                    disabled={activity.status === 'closed'}
                  />
                  {errors.participants && <p className="text-sm text-red-600">{errors.participants}</p>}
                </div>
              </div>

              {/* Evidence */}
              <div className="space-y-6">
                <h2 className="text-[20px] leading-[24px] font-semibold text-zinc-900">Evidence</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Photos * (minimum 2)</Label>
                    <div className="border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                        className="hidden"
                        id="photo-upload"
                        disabled={activity.status === 'closed'}
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                        <p className="text-sm text-zinc-600">Drop photos here or click to upload</p>
                        <p className="text-xs text-zinc-500 mt-1">Minimum 2 photos required</p>
                      </label>
                    </div>
                    {errors.photos && <p className="text-sm text-red-600">{errors.photos}</p>}
                    
                    {activity.photos.length > 0 && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                        {activity.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => handlePhotoRemove(index)}
                              disabled={activity.status === 'closed'}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tickets/CSV (optional)</Label>
                    <div className="border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept=".csv,.pdf,.jpg,.png"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                        disabled={activity.status === 'closed'}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                        <p className="text-sm text-zinc-600">Drop files here or click to upload</p>
                        <p className="text-xs text-zinc-500 mt-1">CSV, PDF, or images</p>
                      </label>
                    </div>
                    
                    {activity.tickets.length > 0 && (
                      <div className="space-y-2 mt-4">
                        {activity.tickets.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                            <span className="text-sm text-zinc-700">{file.name}</span>
                            <button
                              onClick={() => handleFileRemove(index)}
                              disabled={activity.status === 'closed'}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                      id="notes"
                      value={activity.notes}
                      onChange={(e) => setActivity(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional details about the carpool..."
                      rows={3}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      disabled={activity.status === 'closed'}
                    />
                  </div>
                </div>
              </div>

              {/* Integrity & method */}
              <div className="space-y-6">
                <h2 className="text-[20px] leading-[24px] font-semibold text-zinc-900">Integrity & method</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-zinc-900">Double-count check</span>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {activity.status === 'draft' ? 'Not run' : 'OK / No overlap'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-900">Factor set</span>
                    </div>
                    <span className="text-sm text-zinc-600">EU Baltics v2025.1</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-900">Scope & method</span>
                    </div>
                    <span className="text-sm text-zinc-600">Shared transportation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Result preview */}
              <div className="bg-white border border-zinc-200/60 rounded-2xl p-6">
                <h3 className="text-[16px] leading-[20px] font-semibold text-zinc-900 mb-4">Result preview</h3>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {co2eAvoided.toFixed(1)}
                  </div>
                  <div className="text-lg text-zinc-700">kg CO₂e avoided</div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">~{humanEquivalents.carKm} km not driven</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">~{humanEquivalents.fuelLiters}L fuel not burned</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">~{humanEquivalents.electricityKwh} kWh not consumed</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">~{humanEquivalents.treeYears} tree-years equivalent</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 mb-4">
                  Rough, region-based conversions; all values mean avoided impact.
                </p>

                <Button variant="outline" size="sm" className="w-full">
                  Region & factors
                </Button>
              </div>

              {/* Quality & approvals */}
              <div className="bg-white border border-zinc-200/60 rounded-2xl p-6">
                <h3 className="text-[16px] leading-[20px] font-semibold text-zinc-900 mb-4">Quality & approvals</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600">Confidence</span>
                    <Badge variant="secondary">
                      Standard ×1.0
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600">Approvals</span>
                    <span className="text-sm font-medium text-zinc-900">0/2</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white border border-zinc-200/60 rounded-2xl p-6">
                <h3 className="text-[16px] leading-[20px] font-semibold text-zinc-900 mb-4">Actions</h3>
                
                {activity.status === 'draft' && (
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleSave}>
                      Save draft
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full" 
                      onClick={handleStartActivity}
                      disabled={!canStart()}
                    >
                      Start activity
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      disabled={!canClose()}
                      title={!canClose() ? 'Need: photos ≥2, participants ≥1, valid distance/fuel data' : undefined}
                    >
                      Close activity → Generate receipt
                    </Button>
                  </div>
                )}

                {activity.status === 'active' && (
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleSave}>
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full" 
                      onClick={handleCloseActivity}
                      disabled={!canClose()}
                      title={!canClose() ? 'Need: photos ≥2, participants ≥1, valid distance/fuel data' : undefined}
                    >
                      Close activity → Generate receipt
                    </Button>
                  </div>
                )}

                {activity.status === 'closed' && (
                  <div className="space-y-3">
                    <Button size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View receipt
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share link
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download EPK
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
