'use client'
import { useState } from 'react'
import { DocumentViewer } from '@/components/document-viewer'
import { ResultEditor } from '@/components/result-editor'
import { Header } from '@/components/header'

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center gap-3">
          <input type="file" multiple accept=".pdf,.xlsx" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <DocumentViewer files={files} />
          </div>
          <div>
            <ResultEditor files={files} />
          </div>
        </div>
      </div>
    </main>
  )
}


