'use client'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

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

  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  useEffect(() => {
    if (data) {
      // 데이터 로드 후 모든 textarea 높이 자동 조절
      const textareas = document.querySelectorAll('textarea')
      textareas.forEach((textarea) => {
        textarea.style.height = 'auto'
        textarea.style.height = textarea.scrollHeight + 'px'
      })
    }
  }, [data])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button 
          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none rounded-md px-4 py-2 text-sm font-medium transition-colors"
          onClick={handleProcess} 
          disabled={loading || !files.length}
        >
          Process
        </button>
        <button 
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 disabled:pointer-events-none rounded-md px-4 py-2 text-sm font-medium transition-colors"
          onClick={() => setData(null)} 
          disabled={loading || !data}
        >
          Reset
        </button>
        <button 
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none rounded-md px-4 py-2 text-sm font-medium transition-colors"
          onClick={copyJson} 
          disabled={!data}
        >
          Copy JSON
        </button>
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex justify-center items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Processing documents...</span>
          </div>
        </div>
      )}

      {!loading && data && (
        <div className="grid gap-3">
          <label className="text-sm font-medium text-foreground">general_entity</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={JSON.stringify(data.general_entity, null, 2)} 
            onChange={(e) => {
              autoResize(e)
              try { setData({ ...data, general_entity: JSON.parse(e.target.value) }) } catch {}
            }} 
            onInput={autoResize}
          />

          <label className="text-sm font-medium text-foreground">gross_weight_list (comma separated)</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.gross_weight_list.join(', ')} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, gross_weight_list: e.target.value.split(',').map(v => Number(v.trim())).filter(v => !Number.isNaN(v)) })
            }}
            onInput={autoResize}
          />

          <label className="text-sm font-medium text-foreground">average_gross_weight</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.average_gross_weight} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, average_gross_weight: Number(e.target.value) })
            }}
            onInput={autoResize}
          />

          <label className="text-sm font-medium text-foreground">price_list (comma separated)</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.price_list.join(', ')} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, price_list: e.target.value.split(',').map(v => Number(v.trim())).filter(v => !Number.isNaN(v)) })
            }}
            onInput={autoResize}
          />

          <label className="text-sm font-medium text-foreground">average_price</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.average_price} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, average_price: Number(e.target.value) })
            }}
            onInput={autoResize}
          />

          <label className="text-sm font-medium text-foreground">line_item_count</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.line_item_count} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, line_item_count: Number(e.target.value) })
            }}
            onInput={autoResize}
          />
        </div>
      )}
    </div>
  )
}


