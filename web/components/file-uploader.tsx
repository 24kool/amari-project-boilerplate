'use client'
import { useState } from 'react'
import { Upload, FileText, Sheet, X } from 'lucide-react'

type Props = {
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function FileUploader({ files, onFilesChange }: Props) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || 
              file.name.endsWith('.xlsx') || 
              file.name.endsWith('.xls')
    )
    onFilesChange([...files, ...droppedFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? [])
    onFilesChange([...files, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      return <FileText className="h-5 w-5 text-destructive" />
    }
    return <Sheet className="h-5 w-5 text-chart-2" />
  }

  return (
    <div>
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging 
            ? 'border-primary bg-accent' 
            : 'border-input hover:border-ring'
          }
        `}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium text-foreground mb-2">
          Drag and drop files here
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to select files (PDF, Excel)
        </p>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
        <label
          htmlFor="file-input"
          className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
        >
          Select Files
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            Uploaded Files ({files.length})
          </h3>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-card border border-border rounded-md"
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-accent rounded transition-colors"
                aria-label="Remove file"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

