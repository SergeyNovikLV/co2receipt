import JSZip from 'jszip'
import exifr from 'exifr'

export async function buildEpk(files: File[]) {
  const zip = new JSZip()
  for (const file of files) {
    zip.file(file.name, await file.arrayBuffer())
    try {
      await exifr.parse(await file.arrayBuffer())
    } catch {}
  }
  return zip.generateAsync({ type: 'blob' })
}

export async function verifyEpk(blob: Blob) {
  const zip = await JSZip.loadAsync(blob)
  return Object.keys(zip.files).length > 0
}




