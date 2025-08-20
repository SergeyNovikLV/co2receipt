import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function QuickReceipt() {
  return (
    <form className="space-y-4">
      <h1 className="text-2xl font-semibold">Quick receipt</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Activity</Label>
          <Input placeholder="e.g., Clean-up" />
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" />
        </div>
        <div>
          <Label>Location</Label>
          <Input placeholder="City, Country" />
        </div>
        <div>
          <Label>Participants</Label>
          <Input type="number" min={1} />
        </div>
        <div className="md:col-span-2">
          <Label>Notes</Label>
          <Input placeholder="Optional" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="min-h-11 rounded-2xl">Save & finish later</Button>
        <Button className="min-h-11 rounded-2xl">Continue</Button>
      </div>
    </form>
  )
}



