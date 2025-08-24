'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trash2, 
  Camera, 
  FileText, 
  CheckCircle, 
  Circle, 
  Info,
  Save,
  Eye,
  Share2,
  Upload,
  X,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface CleanupActivity {
  id?: string
  name: string
  branch: string
  notes: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  location: string
  gpsLat: string
  gpsLon: string
  participants: string[]
  witnesses: string[]
  entryMode: 'bags' | 'kilograms'
  bags: number
  avgBagWeight: number
  totalWeight: number
  materialsNote: string
  weighTicketsProvided: boolean
  photos: File[]
  tickets: File[]
  notesFiles: File[]
  status: 'draft' | 'ready' | 'closed'
  qualityWeight: number
  confirmAccurate: boolean
}

export default function CleanupActivityPage() {
  const [activity, setActivity] = useState<CleanupActivity>({
    name: 'Community clean-up',
    branch: '',
    notes: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    gpsLat: '',
    gpsLon: '',
    participants: [],
    witnesses: [],
    entryMode: 'bags',
    bags: 0,
    avgBagWeight: 8,
    totalWeight: 0,
    materialsNote: '',
    weighTicketsProvided: false,
    photos: [],
    tickets: [],
    notesFiles: [],
    status: 'draft',
    qualityWeight: 1.0,
    confirmAccurate: false
  })

  const [lastSaved, setLastSaved] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [participantInput, setParticipantInput] = useState('')
  const [witnessInput, setWitnessInput] = useState('')

  // Autosave every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activity.status === 'draft') {
        saveDraft()
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [activity])

  const saveDraft = useCallback(async () => {
    if (activity.status === 'closed') return
    
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setLastSaved(new Date().toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }))
      toast.success('Draft saved')
    } catch (error) {
      toast.error('Failed to save draft')
    } finally {
      setIsSaving(false)
    }
  }, [activity])

  const handleFieldChange = (field: keyof CleanupActivity, value: any) => {
    setActivity(prev => ({ ...prev, [field]: value }))
    // Trigger save on blur for important fields
    if (['name', 'startDate', 'startTime', 'endDate', 'endTime', 'location'].includes(field)) {
      setTimeout(saveDraft, 1000)
    }
  }

  const addParticipant = () => {
    if (participantInput.trim() && !activity.participants.includes(participantInput.trim())) {
      setActivity(prev => ({
        ...prev,
        participants: [...prev.participants, participantInput.trim()]
      }))
      setParticipantInput('')
    }
  }

  const removeParticipant = (index: number) => {
    setActivity(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }))
  }

  const addWitness = () => {
    if (witnessInput.trim() && !activity.witnesses.includes(witnessInput.trim())) {
      setActivity(prev => ({
        ...prev,
        witnesses: [...prev.witnesses, witnessInput.trim()]
      }))
      setWitnessInput('')
    }
  }

  const removeWitness = (index: number) => {
    setActivity(prev => ({
      ...prev,
      witnesses: prev.witnesses.filter((_, i) => i !== index)
    }))
  }

  const handleFileUpload = (type: 'photos' | 'tickets' | 'notes', files: FileList) => {
    const newFiles = Array.from(files)
    setActivity(prev => ({
      ...prev,
      [type]: [...prev[type], ...newFiles]
    }))
  }

  const removeFile = (type: 'photos' | 'tickets' | 'notes', index: number) => {
    setActivity(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const getCompleteness = () => {
    const checks = [
      activity.name.length >= 2 && activity.name.length <= 60,
      activity.startDate && activity.startTime && activity.endDate && activity.endTime && activity.location,
      activity.participants.length > 0,
      (activity.entryMode === 'bags' && activity.bags > 0) || (activity.entryMode === 'kilograms' && activity.totalWeight > 0),
      activity.photos.length > 0
    ]
    return checks.filter(Boolean).length
  }

  const isReadyToClose = () => {
    return getCompleteness() === 5 && activity.confirmAccurate
  }

  const closeActivity = async () => {
    if (!isReadyToClose()) return
    
    setIsClosing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setActivity(prev => ({ ...prev, status: 'closed' }))
      toast.success('Activity closed! Redirecting to receipt...')
      // Redirect to receipt would happen here
    } catch (error) {
      toast.error('Failed to close activity')
    } finally {
      setIsClosing(false)
    }
  }

  const getDurationHint = () => {
    if (!activity.startDate || !activity.startTime || !activity.endDate || !activity.endTime) return ''
    
    const start = new Date(`${activity.startDate}T${activity.startTime}`)
    const end = new Date(`${activity.endDate}T${activity.endTime}`)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.round(diffMs / (1000 * 60 * 60) * 10) / 10
    
    if (diffHours < 0) return 'End time must be after start time'
    return `Duration: ${diffHours} hours`
  }

  const getWasteSummary = () => {
    if (activity.entryMode === 'bags') {
      const totalKg = activity.bags * activity.avgBagWeight
      return `Bags × ${activity.avgBagWeight}kg = ~${totalKg}kg (est.)`
    } else {
      return `Reported ${activity.totalWeight}kg`
    }
  }

  return (
    <div className="max-w-[1280px] mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900 mb-2">Clean-up</h1>
            <p className="text-zinc-600">Plan a clean-up, collect evidence, then close to generate a receipt.</p>
          </div>
          
          {/* Top Action Bar */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={saveDraft}
              disabled={isSaving || activity.status === 'closed'}
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save draft'}
            </Button>
            
            {activity.status === 'closed' ? (
              <>
                <Button>
                  <Eye size={16} className="mr-2" />
                  View receipt
                </Button>
                <Button variant="outline">
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
              </>
            ) : (
              <Button 
                onClick={closeActivity}
                disabled={!isReadyToClose() || isClosing}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isClosing ? 'Closing...' : 'Close activity → Generate receipt'}
              </Button>
            )}
          </div>
        </div>
        
        {/* Save Status */}
        {lastSaved && (
          <div className="flex items-center gap-2 text-sm text-zinc-500 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Saved · {lastSaved}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content - Left Column */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* Basics Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">Basics</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-zinc-900">
                  Activity name *
                </Label>
                <Input
                  id="name"
                  value={activity.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Community clean-up"
                  disabled={activity.status === 'closed'}
                  className="mt-1"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  {activity.name.length}/60 characters
                </p>
              </div>
              
              <div>
                <Label htmlFor="branch" className="text-sm font-medium text-zinc-900">
                  Branch / Organization
                </Label>
                <Input
                  id="branch"
                  value={activity.branch}
                  onChange={(e) => handleFieldChange('branch', e.target.value)}
                  placeholder="e.g., Acme Group — Riga"
                  disabled={activity.status === 'closed'}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-zinc-900">
                  Notes
                </Label>
                <textarea
                  id="notes"
                  value={activity.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  placeholder="Additional details about the clean-up..."
                  disabled={activity.status === 'closed'}
                  className="mt-1 w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* When & Where Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">When & where</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-zinc-900">
                  Start date & time *
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="startDate"
                    type="date"
                    value={activity.startDate}
                    onChange={(e) => handleFieldChange('startDate', e.target.value)}
                    disabled={activity.status === 'closed'}
                  />
                  <Input
                    type="time"
                    value={activity.startTime}
                    onChange={(e) => handleFieldChange('startTime', e.target.value)}
                    disabled={activity.status === 'closed'}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium text-zinc-900">
                  End date & time *
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="endDate"
                    type="date"
                    value={activity.endDate}
                    onChange={(e) => handleFieldChange('endDate', e.target.value)}
                    disabled={activity.status === 'closed'}
                  />
                  <Input
                    type="time"
                    value={activity.endTime}
                    onChange={(e) => handleFieldChange('endTime', e.target.value)}
                    disabled={activity.status === 'closed'}
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="location" className="text-sm font-medium text-zinc-900">
                  Location name *
                </Label>
                <Input
                  id="location"
                  value={activity.location}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  placeholder="e.g., Mežaparks, Riga"
                  disabled={activity.status === 'closed'}
                  className="mt-1"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-zinc-900">
                  GPS coordinates
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Latitude"
                    value={activity.gpsLat}
                    onChange={(e) => handleFieldChange('gpsLat', e.target.value)}
                    disabled={activity.status === 'closed'}
                  />
                  <Input
                    placeholder="Longitude"
                    value={activity.gpsLon}
                    onChange={(e) => handleFieldChange('gpsLon', e.target.value)}
                    disabled={activity.status === 'closed'}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={activity.status === 'closed'}
                  >
                    📍 Use current
                  </Button>
                </div>
              </div>
              
              {getDurationHint() && (
                <div className="md:col-span-2">
                  <p className={`text-sm ${getDurationHint().includes('must be after') ? 'text-red-500' : 'text-zinc-500'}`}>
                    {getDurationHint()}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Team & Roles Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">Team & roles</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-zinc-900">Organizer</Label>
                <div className="mt-1 p-3 bg-zinc-50 rounded-md">
                  <span className="text-sm text-zinc-700">Current User (you)</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-zinc-900">Participants</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={participantInput}
                    onChange={(e) => setParticipantInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                    placeholder="Name or email"
                    disabled={activity.status === 'closed'}
                    className="flex-1"
                  />
                  <Button 
                    onClick={addParticipant}
                    disabled={!participantInput.trim() || activity.status === 'closed'}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                {activity.participants.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activity.participants.map((participant, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {participant}
                        <button
                          onClick={() => removeParticipant(index)}
                          disabled={activity.status === 'closed'}
                          className="ml-1 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-zinc-900">Witnesses</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={witnessInput}
                    onChange={(e) => setWitnessInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addWitness()}
                    placeholder="Name or email"
                    disabled={activity.status === 'closed'}
                    className="flex-1"
                  />
                  <Button 
                    onClick={addWitness}
                    disabled={!witnessInput.trim() || activity.status === 'closed'}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                {activity.witnesses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activity.witnesses.map((witness, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {witness}
                        <button
                          onClick={() => removeWitness(index)}
                          disabled={activity.status === 'closed'}
                          className="ml-1 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Waste & Method Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">Waste & method</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-zinc-900">
                  Entry mode
                  <span className="ml-1 text-zinc-400 cursor-help" title="If you don't have a scale, enter number of bags and average weight will be applied.">
                    <Info size={14} />
                  </span>
                </Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="entryMode"
                      value="bags"
                      checked={activity.entryMode === 'bags'}
                      onChange={(e) => handleFieldChange('entryMode', e.target.value)}
                      disabled={activity.status === 'closed'}
                    />
                    <span className="text-sm">Bags</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="entryMode"
                      value="kilograms"
                      checked={activity.entryMode === 'kilograms'}
                      onChange={(e) => handleFieldChange('entryMode', e.target.value)}
                      disabled={activity.status === 'closed'}
                    />
                    <span className="text-sm">Kilograms</span>
                  </label>
                </div>
              </div>
              
              {activity.entryMode === 'bags' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bags" className="text-sm font-medium text-zinc-900">
                      Number of bags *
                    </Label>
                    <Input
                      id="bags"
                      type="number"
                      value={activity.bags || ''}
                      onChange={(e) => handleFieldChange('bags', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="1"
                      disabled={activity.status === 'closed'}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avgBagWeight" className="text-sm font-medium text-zinc-900">
                      Avg bag weight (kg)
                    </Label>
                    <Input
                      id="avgBagWeight"
                      type="number"
                      value={activity.avgBagWeight || ''}
                      onChange={(e) => handleFieldChange('avgBagWeight', parseFloat(e.target.value) || 8)}
                      placeholder="8"
                      step="0.1"
                      disabled={activity.status === 'closed'}
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalWeight" className="text-sm font-medium text-zinc-900">
                      Total waste weight (kg) *
                    </Label>
                    <Input
                      id="totalWeight"
                      type="number"
                      value={activity.totalWeight || ''}
                      onChange={(e) => handleFieldChange('totalWeight', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      step="0.1"
                      min="0.1"
                      disabled={activity.status === 'closed'}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="materialsNote" className="text-sm font-medium text-zinc-900">
                      Material notes
                    </Label>
                    <Input
                      id="materialsNote"
                      value={activity.materialsNote}
                      onChange={(e) => handleFieldChange('materialsNote', e.target.value)}
                      placeholder="e.g., plastic/metal/mixed"
                      disabled={activity.status === 'closed'}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium text-zinc-900">
                  Weigh tickets provided?
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="weighTickets"
                    checked={activity.weighTicketsProvided}
                    onChange={(e) => {
                      handleFieldChange('weighTicketsProvided', e.target.checked)
                      handleFieldChange('qualityWeight', e.target.checked ? 1.2 : 1.0)
                    }}
                    disabled={activity.status === 'closed'}
                  />
                  <Label htmlFor="weighTickets" className="text-sm">
                    Upload weigh tickets (sets Quality to Weighed ×1.2)
                  </Label>
                </div>
              </div>
              
              <div className="p-3 bg-zinc-50 rounded-md">
                <p className="text-sm text-zinc-600">
                  Double-count check: {activity.name ? 'No overlap near time/location' : 'Check after save'}
                </p>
              </div>
            </div>
          </Card>

          {/* Evidence Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">Evidence</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-zinc-900">Photos *</Label>
                  <div className="mt-1">
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.heic"
                      onChange={(e) => e.target.files && handleFileUpload('photos', e.target.files)}
                      disabled={activity.status === 'closed'}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="block p-4 border-2 border-dashed border-zinc-300 rounded-md text-center cursor-pointer hover:border-zinc-400 transition-colors"
                    >
                      <Camera size={24} className="mx-auto mb-2 text-zinc-400" />
                      <span className="text-sm text-zinc-600">Upload photos</span>
                      <p className="text-xs text-zinc-500 mt-1">
                        {activity.photos.length} file{activity.photos.length !== 1 ? 's' : ''}
                      </p>
                    </label>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-zinc-900">
                    Tickets/CSV
                    {activity.weighTicketsProvided && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <div className="mt-1">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.csv"
                      onChange={(e) => e.target.files && handleFileUpload('tickets', e.target.files)}
                      disabled={activity.status === 'closed'}
                      className="hidden"
                      id="ticket-upload"
                    />
                    <label
                      htmlFor="ticket-upload"
                      className="block p-4 border-2 border-dashed border-zinc-300 rounded-md text-center cursor-pointer hover:border-zinc-400 transition-colors"
                    >
                      <FileText size={24} className="mx-auto mb-2 text-zinc-400" />
                      <span className="text-sm text-zinc-600">Upload tickets</span>
                      <p className="text-xs text-zinc-500 mt-1">
                        {activity.tickets.length} file{activity.tickets.length !== 1 ? 's' : ''}
                      </p>
                    </label>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-zinc-900">Notes</Label>
                  <div className="mt-1">
                    <input
                      type="file"
                      multiple
                      accept=".txt,.md,.pdf"
                      onChange={(e) => e.target.files && handleFileUpload('notes', e.target.files)}
                      disabled={activity.status === 'closed'}
                      className="hidden"
                      id="notes-upload"
                    />
                    <label
                      htmlFor="notes-upload"
                      className="block p-4 border-2 border-dashed border-zinc-300 rounded-md text-center cursor-pointer hover:border-zinc-400 transition-colors"
                    >
                      <FileText size={24} className="mx-auto mb-2 text-zinc-400" />
                      <span className="text-sm text-zinc-600">Upload notes</span>
                      <p className="text-xs text-zinc-500 mt-1">
                        {activity.notesFiles.length} file{activity.notesFiles.length !== 1 ? 's' : ''}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* File Thumbnails */}
              {(activity.photos.length > 0 || activity.tickets.length > 0 || activity.notesFiles.length > 0) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-zinc-900">Uploaded files</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Open evidence pack
                      </Button>
                      <Button variant="outline" size="sm">
                        Import ZIP
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {activity.photos.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="w-full h-20 bg-zinc-100 rounded border flex items-center justify-center">
                          <Camera size={20} className="text-zinc-400" />
                        </div>
                        <p className="text-xs text-zinc-600 mt-1 truncate">{file.name}</p>
                        <button
                          onClick={() => removeFile('photos', index)}
                          disabled={activity.status === 'closed'}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    
                    {activity.tickets.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="w-full h-20 bg-zinc-100 rounded border flex items-center justify-center">
                          <FileText size={20} className="text-zinc-400" />
                        </div>
                        <p className="text-xs text-zinc-600 mt-1 truncate">{file.name}</p>
                        <button
                          onClick={() => removeFile('tickets', index)}
                          disabled={activity.status === 'closed'}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    
                    {activity.notesFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="w-full h-20 bg-zinc-100 rounded border flex items-center justify-center">
                          <FileText size={20} className="text-zinc-400" />
                        </div>
                        <p className="text-xs text-zinc-600 mt-1 truncate">{file.name}</p>
                        <button
                          onClick={() => removeFile('notes', index)}
                          disabled={activity.status === 'closed'}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activity.photos.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  <Camera size={48} className="mx-auto mb-3 text-zinc-300" />
                  <p>Add at least one photo to proceed.</p>
                </div>
              )}
            </div>
          </Card>

          {/* Quality Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">Quality</h2>
            <div className="flex items-center gap-3">
              <Badge 
                variant={activity.qualityWeight === 1.2 ? "default" : "secondary"}
                className="text-sm px-3 py-1"
              >
                {activity.qualityWeight === 1.2 ? 'Weighed ×1.2' : 'Standard ×1.0'}
              </Badge>
              <span className="text-sm text-zinc-600">
                Confidence is a quality weight applied when evidence includes official weigh tickets.
              </span>
            </div>
          </Card>

          {/* Review & Close Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">Review & close</h2>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-50 rounded-md">
                <p className="text-sm text-zinc-900 font-medium">{getWasteSummary()}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Calculated with Waste (C5). Technical details will be on the receipt.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirmAccurate"
                  checked={activity.confirmAccurate}
                  onChange={(e) => handleFieldChange('confirmAccurate', e.target.checked)}
                  disabled={activity.status === 'closed'}
                  className="mt-1"
                />
                <Label htmlFor="confirmAccurate" className="text-sm text-zinc-700">
                  I confirm information is accurate.
                </Label>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={closeActivity}
                  disabled={!isReadyToClose() || isClosing}
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isClosing ? 'Closing...' : 'Close activity → Generate receipt'}
                </Button>
                
                {!isReadyToClose() && (
                  <p className="text-sm text-zinc-500 mt-2 text-center">
                    Complete required fields to enable closing
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Rail - Sticky */}
        <div className="col-span-12 lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            
            {/* Status Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Status</h3>
              <div className="space-y-3">
                <Badge 
                  variant={activity.status === 'closed' ? 'default' : 'secondary'}
                  className="w-full justify-center"
                >
                  {activity.status === 'draft' && 'Draft'}
                  {activity.status === 'ready' && 'Ready to close'}
                  {activity.status === 'closed' && 'Closed'}
                </Badge>
                
                <div className="text-sm text-zinc-600">
                  {activity.status === 'draft' && 'Save to continue editing'}
                  {activity.status === 'ready' && 'All required fields complete'}
                  {activity.status === 'closed' && 'Activity closed, receipt generated'}
                </div>
              </div>
            </Card>

            {/* Completeness Meter */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Completeness</h3>
              <div className="space-y-3">
                {[
                  { label: 'Basics', complete: activity.name.length >= 2 && activity.name.length <= 60 },
                  { label: 'Time & Place', complete: activity.startDate && activity.startTime && activity.endDate && activity.endTime && activity.location },
                  { label: 'Team', complete: activity.participants.length > 0 },
                  { label: 'Waste', complete: (activity.entryMode === 'bags' && activity.bags > 0) || (activity.entryMode === 'kilograms' && activity.totalWeight > 0) },
                  { label: 'Evidence', complete: activity.photos.length > 0 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.complete ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Circle size={16} className="text-zinc-300" />
                    )}
                    <span className="text-sm text-zinc-700">{item.label}</span>
                  </div>
                ))}
                
                <div className="pt-2">
                  <div className="w-full bg-zinc-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(getCompleteness() / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 text-center">
                    {getCompleteness()}/5 complete
                  </p>
                </div>
              </div>
            </Card>

            {/* Approvals */}
            {activity.status !== 'draft' && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">Approvals</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-zinc-700">Organizer (me)</span>
                  </div>
                  
                  {activity.participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Circle size={16} className="text-zinc-300" />
                      <span className="text-sm text-zinc-700">{participant}</span>
                    </div>
                  ))}
                  
                  {activity.witnesses.map((witness, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Circle size={16} className="text-zinc-300" />
                      <span className="text-sm text-zinc-700">{witness}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Shortcuts */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Shortcuts</h3>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  <Upload size={16} className="mr-2" />
                  Import evidence (ZIP)
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye size={16} className="mr-2" />
                  View sample receipt
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
