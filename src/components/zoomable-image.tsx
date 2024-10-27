'use client'

import { useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

// Import the image using Next.js Image component for better performance
import ImageSrc from '@/lib/Untitled design (1).png'

export function ZoomableImage() {
  const [scale, setScale] = useState(1)

  return (
    <div className="w-full mx-auto p-4">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        onZoomChange={(ref) => setScale(ref.state.scale)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Updated to center the container */}
            <div className="relative border rounded-lg overflow-hidden mb-4 flex items-center justify-center" style={{ height: '1000px', width: '100%' }}>
              <TransformComponent wrapperClass="w-full h-full flex items-center justify-center">
                <div className="flex justify-center">
                  {/* Ensure high-resolution image and disable optimization */}
                  <Image
                    src={ImageSrc}
                    alt="Zoomable Image"
                    width={1600} // Set larger width for higher resolution
                    height={1000} // Set larger height for higher resolution
                    objectFit="contain"
                    priority
                    unoptimized // Disable image optimization for high-quality zoom
                  />
                </div>
              </TransformComponent>
            </div>
            <div className="flex justify-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => zoomIn()}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => zoomOut()}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => resetTransform()}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500">
              Current zoom: {Math.round(scale * 100)}%
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}
