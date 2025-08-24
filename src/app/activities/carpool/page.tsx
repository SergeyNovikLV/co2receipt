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
  Car,
  Users,
  MapPin,
  Calendar,
  Clock,
  Fuel
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const branches = ['Marketing', 'Engineering', 'Sales', 'HR', 'Other']
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid']

export default function CarpoolPage() {
  const router = useRouter()
  const [activity, setActivity] = useState({
    name: 'Team carpool',
    branch: '',
    startDate: '',
    endDate: '',
    city: '',
    place: '',
    lat: '',
    lng: '',
    organizerEmail: 'organizer@example.com',
    participants: 1,
    fuelType: '',
    distance: 0,
    fuelEfficiency: 7.0,
    photos: [],
    notes: ''
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
        body: JSON.stringify({ type: 'carpool' }),
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
        <h1 className="text-2xl font-semibold text-zinc-900">Carpool Activity</h1>
        <p className="text-zinc-600">Create a new carpool activity</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                Activity name *
              </Label>
              <Input
                id="name"
                value={activity.name}
                onChange={(e) => setActivity(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Team carpool to conference"
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
                Destination *
              </Label>
              <Input
                id="place"
                value={activity.place}
                onChange={(e) => setActivity(prev => ({ ...prev, place: e.target.value }))}
                placeholder="e.g., Conference center"
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

        {/* Carpool Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Carpool Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="participants" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                Number of passengers *
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
              <Label htmlFor="distance" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                Distance (km) *
              </Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                value={activity.distance}
                onChange={(e) => setActivity(prev => ({ ...prev, distance: parseFloat(e.target.value) || 0 }))}
                placeholder="0.0"
                className="mt-2 h-11 rounded-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="fuelType" className="text-[14px] leading-[20px] font-medium text-zinc-900">
                Fuel type
              </Label>
              <CustomDropdown
                options={[
                  { value: '', label: 'Select fuel type' },
                  ...fuelTypes.map(type => ({ value: type, label: type }))
                ]}
                value={activity.fuelType}
                onChange={(value) => setActivity(prev => ({ ...prev, fuelType: value }))}
                placeholder="Select fuel type"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="fuelEfficiency" className="text-[14px] leading-[20px] font-medium text-zinc-900">
              Fuel efficiency (L/100km)
            </Label>
            <Input
              id="fuelEfficiency"
              type="number"
              step="0.1"
              value={activity.fuelEfficiency}
              onChange={(e) => setActivity(prev => ({ ...prev, fuelEfficiency: parseFloat(e.target.value) || 7.0 }))}
              placeholder="7.0"
              className="mt-2 h-11 rounded-lg"
            />
          </div>
        </Card>

        {/* Team */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 border-2 border-dashed border-zinc-300 rounded-lg">
              <Car className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-600">Vehicle</p>
              <p className="text-xs text-zinc-500">Car photo</p>
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
    </div>
  )
}
