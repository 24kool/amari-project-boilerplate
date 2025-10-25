'use client'
import { useEffect, useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = { files: File[] }

type FileCache = {
  url: string
  excelData?: any[][]
}

export function DocumentViewer({ files }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [url, setUrl] = useState<string | null>(null)
  const [excelData, setExcelData] = useState<any[][] | null>(null)
  const cacheRef = useRef<Map<File, FileCache>>(new Map())

  const file = files[currentIndex] || null

  // Clean up cache when file array changes
  useEffect(() => {
    const cache = cacheRef.current
    const currentFiles = new Set(files)
    
    // Revoke URLs for files that are no longer in use
    cache.forEach((value, key) => {
      if (!currentFiles.has(key)) {
        URL.revokeObjectURL(value.url)
        cache.delete(key)
      }
    })

    // Reset index if it's out of bounds
    if (currentIndex >= files.length && files.length > 0) {
      setCurrentIndex(0)
    }
  }, [files, currentIndex])

  // Clean up all URLs on component unmount
  useEffect(() => {
    return () => {
      const cache = cacheRef.current
      cache.forEach((value) => {
        URL.revokeObjectURL(value.url)
      })
      cache.clear()
    }
  }, [])

  // Load current file
  useEffect(() => {
    if (!file) { 
      setUrl(null)
      setExcelData(null)
      return 
    }

    const cache = cacheRef.current
    
    // Reuse from cache if available
    if (cache.has(file)) {
      const cached = cache.get(file)!
      setUrl(cached.url)
      setExcelData(cached.excelData || null)
      return
    }

    // Create URL for new file
    const blobUrl = URL.createObjectURL(file)
    setUrl(blobUrl)

    // Parse Excel file data
    const isExcel = file.name.toLowerCase().endsWith('.xlsx') || 
                    file.name.toLowerCase().endsWith('.xls') ||
                    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.type === 'application/vnd.ms-excel'

    if (isExcel) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][]
          setExcelData(jsonData)
          // Save to cache
          cache.set(file, { url: blobUrl, excelData: jsonData })
        } catch (error) {
          console.error('Excel parsing error:', error)
          setExcelData(null)
          cache.set(file, { url: blobUrl })
        }
      }
      reader.readAsBinaryString(file)
    } else {
      setExcelData(null)
      // For PDF, only cache the URL
      cache.set(file, { url: blobUrl })
    }
  }, [file])

  if (!file) return <div className="text-sm text-muted-foreground">No file selected</div>

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  const isExcel = file.name.toLowerCase().endsWith('.xlsx') || 
                  file.name.toLowerCase().endsWith('.xls') ||
                  file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                  file.type === 'application/vnd.ms-excel'

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="w-full h-[85vh] border border-border rounded-md overflow-hidden bg-card flex flex-col">
      <div className="flex-1 overflow-auto">
        {isPdf && url ? (
          <object data={`${url}#pagemode=none`} type="application/pdf" className="w-full h-full">
            <p className="p-4 text-sm">PDF preview unavailable. <a className="underline" href={url} target="_blank">Open in new tab</a></p>
          </object>
        ) : isExcel && excelData ? (
          <div className="p-4">
            <div className="text-sm font-semibold text-foreground mb-2">{file.name}</div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-border text-sm">
                <tbody>
                  {excelData.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex === 0 ? 'bg-muted font-semibold' : ''}>
                      {row.map((cell, cellIndex) => (
                        <td 
                          key={cellIndex} 
                          className="border border-border px-3 py-2 text-foreground"
                        >
                          {cell !== null && cell !== undefined ? String(cell) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : isExcel && !excelData ? (
          <div className="p-4 text-sm text-muted-foreground">
            Loading Excel file...
          </div>
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            Preview not supported for this file type. ({file.name})
          </div>
        )}
      </div>
      
      {/* Navigation Controls */}
      {files.length > 1 && (
        <div className="border-t border-border bg-muted px-4 py-3 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            className="p-2 bg-background border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous file"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-sm text-muted-foreground font-medium">
            {currentIndex + 1} / {files.length}
          </div>
          <button
            onClick={handleNext}
            className="p-2 bg-background border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next file"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}


