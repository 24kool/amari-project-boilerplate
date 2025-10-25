'use client'
import { useState } from 'react'

type Result = {
  general_entity: any
  gross_weight_list: number[]
  average_gross_weight: number
  price_list: number[]
  average_price: number
  line_item_count: number
}

type Props = { files: File[] }

export function ResultEditor({ files }: Props) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleProcess() {
    if (!files.length) return
    const formData = new FormData()
    for (const f of files) formData.append('files', f)
    setLoading(true)
    setError(null)
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
      const res = await fetch(`${base}/api/process-documents`, { method: 'POST', body: formData })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setData(json)
    } catch (e: any) {
      setError(e?.message ?? 'Request failed')
    } finally { setLoading(false) }
  }

  function copyJson() {
    if (!data) return
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button className="border rounded px-3 py-2" onClick={handleProcess} disabled={loading || !files.length}>Process</button>
        <button className="border rounded px-3 py-2" onClick={() => setData(null)} disabled={loading || !data}>Reset</button>
        <button className="border rounded px-3 py-2" onClick={copyJson} disabled={!data}>Copy JSON</button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {data && (
        <div className="grid gap-3">
          <label className="text-sm font-medium">general_entity</label>
          <textarea className="border rounded p-2 min-h-[160px] font-mono text-sm" value={JSON.stringify(data.general_entity, null, 2)} onChange={(e) => {
            try { setData({ ...data, general_entity: JSON.parse(e.target.value) }) } catch {}
          }} />

          <label className="text-sm font-medium">gross_weight_list (comma separated)</label>
          <input className="border rounded p-2" value={data.gross_weight_list.join(', ')} onChange={(e) => setData({ ...data, gross_weight_list: e.target.value.split(',').map(v => Number(v.trim())).filter(v => !Number.isNaN(v)) })} />

          <label className="text-sm font-medium">average_gross_weight</label>
          <input className="border rounded p-2" type="number" value={data.average_gross_weight} onChange={(e) => setData({ ...data, average_gross_weight: Number(e.target.value) })} />

          <label className="text-sm font-medium">price_list (comma separated)</label>
          <input className="border rounded p-2" value={data.price_list.join(', ')} onChange={(e) => setData({ ...data, price_list: e.target.value.split(',').map(v => Number(v.trim())).filter(v => !Number.isNaN(v)) })} />

          <label className="text-sm font-medium">average_price</label>
          <input className="border rounded p-2" type="number" value={data.average_price} onChange={(e) => setData({ ...data, average_price: Number(e.target.value) })} />

          <label className="text-sm font-medium">line_item_count</label>
          <input className="border rounded p-2" type="number" value={data.line_item_count} onChange={(e) => setData({ ...data, line_item_count: Number(e.target.value) })} />
        </div>
      )}
    </div>
  )
}


