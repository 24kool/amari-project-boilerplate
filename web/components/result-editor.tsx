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
      console.log('📊 Received data:', JSON.stringify(data, null, 2))
      
      const params = new URLSearchParams()
      
      // general_entity에서 필요한 필드 추출
      const entity = data.general_entity || {}
      console.log('📦 Entity:', JSON.stringify(entity, null, 2))
      console.log('📦 Entity keys:', Object.keys(entity))
      
      // Bill of Lading Number
      const blValue = entity.bill_of_lading_number || entity.billOfLadingNumber || entity.bl_number || ''
      console.log('🏷️ Bill of Lading:', blValue)
      if (blValue) {
        params.append(`entry.${FORM_ENTRY_IDS.billOfLading}`, blValue)
      }
      
      // Container Number
      const containerValue = entity.container_number || entity.containerNumber || ''
      console.log('📦 Container:', containerValue)
      if (containerValue) {
        params.append(`entry.${FORM_ENTRY_IDS.containerNumber}`, containerValue)
      }
      
      // Consignee Name
      const consigneeNameValue = entity.consignee_name || entity.consigneeName || entity.consignee || ''
      console.log('👤 Consignee Name:', consigneeNameValue)
      if (consigneeNameValue) {
        params.append(`entry.${FORM_ENTRY_IDS.consigneeName}`, consigneeNameValue)
      }
      
      // Consignee Address
      const addressValue = entity.consignee_address || entity.consigneeAddress || ''
      console.log('📍 Address:', addressValue)
      if (addressValue) {
        params.append(`entry.${FORM_ENTRY_IDS.consigneeAddress}`, addressValue)
      }
      
      // Date of Export
      const dateValue = entity.date_of_export || entity.dateOfExport || entity.export_date || ''
      console.log('📅 Date:', dateValue)
      if (dateValue) {
        params.append(`entry.${FORM_ENTRY_IDS.dateOfExport}`, dateValue)
      }
      
      // Line Items Count
      console.log('🔢 Line Items:', data.line_item_count)
      if (data.line_item_count) {
        params.append(`entry.${FORM_ENTRY_IDS.lineItemsCount}`, String(data.line_item_count))
      }
      
      // Average Gross Weight
      console.log('⚖️ Weight:', data.average_gross_weight)
      if (data.average_gross_weight) {
        params.append(`entry.${FORM_ENTRY_IDS.averageGrossWeight}`, String(data.average_gross_weight))
      }
      
      // Average Price
      console.log('💰 Price:', data.average_price)
      if (data.average_price) {
        params.append(`entry.${FORM_ENTRY_IDS.averagePrice}`, String(data.average_price))
      }
      
      const url = `${FORM_BASE_URL}?${params.toString()}`
      console.log('🔗 Generated URL:', url)
      console.log('🔗 URL params:', params.toString())
      setFormUrl(url)
      
      // 자동으로 새 탭에서 Form 열기
      window.open(url, '_blank')
    }
  }, [data])

  function copyJson() {
    if (!data) return
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  }

  function openFormInNewTab() {
    if (formUrl) {
      window.open(formUrl, '_blank')
    }
  }

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
        <div className="space-y-4">
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Processing Complete! Google Form Opened Automatically
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  The Google Form with auto-filled data has been opened in a new tab. 
                  Please review and submit the form.
                </p>
                <div className="mt-4 p-3 bg-white rounded border border-green-200">
                  <p className="text-xs font-medium text-gray-600 mb-1">Form URL:</p>
                  <a 
                    href={formUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline break-all"
                  >
                    {formUrl}
                  </a>
                </div>
                <button
                  onClick={openFormInNewTab}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Open Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


