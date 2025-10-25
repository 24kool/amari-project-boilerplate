'use client'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

type Result = {
  general_entity: any
  gross_weight_list: any
  average_gross_weight: any
  price_list: any
  average_price: any
  line_item_count: any
}

type Props = { files: File[] }

// Google Form Entry IDs
// Note: These IDs must be the actual entry IDs from the form
// How to find: Open the form, press F12, and inspect each input tag for name="entry.XXXXXXX"
const FORM_ENTRY_IDS = {
  billOfLading: '1641021725',  // Bill of lading number
  containerNumber: '1026077439',  // Container Number
  consigneeName: '111572852',  // Consignee Name
  consigneeAddress: '1466739846',  // Consignee Address
  dateOfExport: '1733712848',  // Date of export
  lineItemsCount: '1492261839',  // Line Items Count
  averageGrossWeight: '605394403',  // Average Gross Weight
  averagePrice: '1951650481'  // Average Price
}

const FORM_BASE_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSemlBSMvQsQZnAudDXMWXGldJGdZW6VkoDAwbQKsuTGlgZfNg/viewform'

export function ResultEditor({ files }: Props) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formUrl, setFormUrl] = useState<string>(FORM_BASE_URL)

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

  // 데이터가 로드되면 Google Form URL을 pre-fill된 값으로 생성
  useEffect(() => {
    if (data) {
      // 첫 로드 시 배열을 문자열로 변환
      if (Array.isArray(data.gross_weight_list)) {
        setData({ ...data, gross_weight_list: data.gross_weight_list.join(', ') })
        return
      }
      if (Array.isArray(data.price_list)) {
        setData({ ...data, price_list: data.price_list.join(', ') })
        return
      }
      
      const params = new URLSearchParams()
      
      // general_entity에서 필요한 필드 추출
      const entity = data.general_entity || {}
      
      // Bill of Lading Number
      const blValue = entity.bill_of_lading_number || entity.billOfLadingNumber || entity.bl_number || ''
      if (blValue) {
        params.append(`entry.${FORM_ENTRY_IDS.billOfLading}`, blValue)
      }
      
      // Container Number
      const containerValue = entity.container_number || entity.containerNumber || ''
      if (containerValue) {
        params.append(`entry.${FORM_ENTRY_IDS.containerNumber}`, containerValue)
      }
      
      // Consignee Name
      const consigneeNameValue = entity.consignee_name || entity.consigneeName || entity.consignee || ''
      if (consigneeNameValue) {
        params.append(`entry.${FORM_ENTRY_IDS.consigneeName}`, consigneeNameValue)
      }
      
      // Consignee Address
      const addressValue = entity.consignee_address || entity.consigneeAddress || ''
      if (addressValue) {
        params.append(`entry.${FORM_ENTRY_IDS.consigneeAddress}`, addressValue)
      }
      
      // Date of Export
      const dateValue = entity.date_of_export || entity.dateOfExport || entity.export_date || ''
      if (dateValue) {
        params.append(`entry.${FORM_ENTRY_IDS.dateOfExport}`, dateValue)
      }
      
      // Line Items Count
      if (data.line_item_count) {
        params.append(`entry.${FORM_ENTRY_IDS.lineItemsCount}`, String(data.line_item_count))
      }
      
      // Average Gross Weight
      if (data.average_gross_weight) {
        params.append(`entry.${FORM_ENTRY_IDS.averageGrossWeight}`, String(data.average_gross_weight))
      }
      
      // Average Price
      if (data.average_price) {
        params.append(`entry.${FORM_ENTRY_IDS.averagePrice}`, String(data.average_price))
      }
      
      const url = `${FORM_BASE_URL}?${params.toString()}`
      setFormUrl(url)
    }
  }, [data])

  function openFormInNewTab() {
    if (formUrl) {
      window.open(formUrl, '_blank')
    }
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
          className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none rounded-md px-4 py-2 text-sm font-medium transition-colors"
          onClick={openFormInNewTab} 
          disabled={!data}
        >
          Fill out Google Form
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
          <label className="text-sm font-medium text-foreground">bill_of_lading_number</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.general_entity?.bill_of_lading_number || ''} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, general_entity: { ...data.general_entity, bill_of_lading_number: e.target.value } })
            }} 
            onInput={autoResize}
          />

          <label className="text-sm font-medium text-foreground">container_number</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.general_entity?.container_number || ''} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, general_entity: { ...data.general_entity, container_number: e.target.value } })
            }} 
            onInput={autoResize}
          />

          <label className="text-sm font-medium text-foreground">consignee_name</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.general_entity?.consignee_name || ''} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, general_entity: { ...data.general_entity, consignee_name: e.target.value } })
            }} 
            onInput={autoResize}
          />

          <label className="text-sm font-medium text-foreground">consignee_address</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.general_entity?.consignee_address || ''} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, general_entity: { ...data.general_entity, consignee_address: e.target.value } })
            }} 
            onInput={autoResize}
          />

          <label className="text-sm font-medium text-foreground">date_of_export</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.general_entity?.date_of_export || ''} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, general_entity: { ...data.general_entity, date_of_export: e.target.value } })
            }} 
            onInput={autoResize}
          />

          <label className="text-sm font-medium text-foreground">gross_weight_list (comma separated)</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.gross_weight_list} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, gross_weight_list: e.target.value })
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
              setData({ ...data, average_gross_weight: e.target.value })
            }}
            onInput={autoResize}
          />

          <label className="text-sm font-medium text-foreground">price_list (comma separated)</label>
          <textarea 
            rows={1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden" 
            value={data.price_list} 
            onChange={(e) => {
              autoResize(e)
              setData({ ...data, price_list: e.target.value })
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
              setData({ ...data, average_price: e.target.value })
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
              setData({ ...data, line_item_count: e.target.value })
            }}
            onInput={autoResize}
          />
        </div>
      )}
    </div>
  )
}


