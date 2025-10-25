'use client'
import { useEffect, useState } from 'react'

type Props = { file?: File | null }

export function DocumentViewer({ file }: Props) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) { setUrl(null); return }
    const blobUrl = URL.createObjectURL(file)
    setUrl(blobUrl)
    return () => URL.revokeObjectURL(blobUrl)
  }, [file])

  if (!file) return <div className="text-sm text-muted-foreground">No file selected</div>

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

  return (
    <div className="w-full h-[70vh] border rounded-md overflow-hidden bg-white">
      {isPdf && url ? (
        <object data={url} type="application/pdf" className="w-full h-full">
          <p className="p-4 text-sm">PDF preview unavailable. <a className="underline" href={url} target="_blank">Open in new tab</a></p>
        </object>
      ) : (
        <div className="p-4 text-sm">
          Preview not supported for this file type. ({file.name})
        </div>
      )}
    </div>
  )
}


