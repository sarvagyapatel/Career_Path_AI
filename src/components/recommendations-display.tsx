/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-children-prop */
'use client'

import React, { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CardContent } from '@/components/ui/card'

interface RecommendationsDisplayProps {
  isLoading: boolean
  error: string | null
  recommendations: string[]
  onRetry: () => void
}

export function RecommendationsDisplayComponent({
  isLoading,
  error,
  recommendations,
  onRetry
}: RecommendationsDisplayProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  return (
    <CardContent>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={onRetry}>Retry</Button>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4" ref={scrollAreaRef}>
          {recommendations.map((line, index) => (
            <div key={index} className="mb-4">
              <ReactMarkdown
                children={line}
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => <a {...props} className="text-blue-600 underline break-words" />,
                  strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
                  h1: ({ node, ...props }) => <h1 {...props} className="text-2xl font-bold mt-4 mb-2 break-words" />,
                  h2: ({ node, ...props }) => <h2 {...props} className="text-xl font-bold mt-3 mb-2 break-words" />,
                  p: ({ node, ...props }) => <p {...props} className="mb-2 whitespace-pre-wrap break-words" />,
                  ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 mb-2" />,
                  ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-5 mb-2" />,
                  li: ({ node, ...props }) => <li {...props} className="mb-1 break-words" />,
                  code: ({ node, inline, ...props }) => (
                    inline
                      ? <code {...props} className="bg-gray-100 rounded px-1 py-0.5 break-words" />
                      : <pre className="bg-gray-100 rounded p-2 my-2 whitespace-pre-wrap break-words"><code {...props} /></pre>
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto">
                      <table {...props} className="min-w-full divide-y divide-gray-200" />
                    </div>
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote {...props} className="border-l-4 border-gray-200 pl-4 italic my-4" />
                  ),
                }}
                className="max-w-full"
              />
            </div>
          ))}
          {recommendations.length === 0 && (
            <p className="text-muted-foreground">Waiting for recommendations...</p>
          )}
        </ScrollArea>
      )}
    </CardContent>
  )
}