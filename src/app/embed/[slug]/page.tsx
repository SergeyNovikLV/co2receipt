import Link from 'next/link'

export default function EmbedBadge({ params }: { params: { slug: string } }) {
  const href = `/r/${params.slug}`
  return (
    <div className="w-[min(480px,100%)] mx-auto p-3">
      <a href={href} className="block rounded-3xl ring-1 ring-muted bg-white p-4">
        <div className="text-sm font-medium">CO₂ Receipt</div>
        <div className="text-xs text-muted-foreground">View public receipt →</div>
      </a>
    </div>
  )
}




