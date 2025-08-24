'use client'

import { useState } from 'react'
import exifr from 'exifr'
import JSZip from 'jszip'
import { toast } from 'sonner'

export default function EvidenceUpload() {
  const [files, setFiles] = useState<File[]>([])

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    setFiles(selected)
    if (selected[0]) {
      try {
        const exif = await exifr.parse(await selected[0].arrayBuffer()).catch(() => null)
        toast(JSON.stringify(exif ? { make: exif.Make, model: exif.Model } : { info: 'No EXIF' }))
      } catch {}
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Evidence upload</h1>
      <input className="block w-full" type="file" multiple onChange={onChange} />
      <ul className="text-sm text-muted-foreground space-y-2">
        {files.map((f) => (
          <li key={f.name}>{f.name}</li>
        ))}
      </ul>
    </div>
  )
}




