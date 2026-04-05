import * as React from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/lib/utils'

interface ImageAsset {
  src: string
  fileName?: string
  width?: number
  height?: number
}

interface GalleryViewerProps {
  images: ImageAsset[]
}

export function GalleryViewer({ images }: GalleryViewerProps) {
  const [open, setOpen] = React.useState(false)
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()
  const [isLoading, setIsLoading] = React.useState<Record<number, boolean>>({})
  const reducedMotion = useReducedMotion()

  React.useEffect(() => {
    if (!api) return
    api.scrollTo(current, true)
  }, [api, current, open])

  // Actualizar el índice actual cuando cambia el slide
  React.useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on('select', handleSelect)
    return () => {
      api.off('select', handleSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!open || !api) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        api.scrollPrev()
        setTimeout(() => setCurrent(api.selectedScrollSnap()), 50)
      }
      if (e.key === 'ArrowRight') {
        api.scrollNext()
        setTimeout(() => setCurrent(api.selectedScrollSnap()), 50)
      }
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, api])

  const scrollPrev = React.useCallback(() => {
    if (!api) return
    api.scrollPrev()
    // Forzar actualización del estado después de la navegación
    setTimeout(() => {
      setCurrent(api.selectedScrollSnap())
    }, 50)
  }, [api])

  const scrollNext = React.useCallback(() => {
    if (!api) return
    api.scrollNext()
    // Forzar actualización del estado después de la navegación
    setTimeout(() => {
      setCurrent(api.selectedScrollSnap())
    }, 50)
  }, [api])

  const handleImageLoad = (index: number) => {
    setIsLoading((prev) => ({
      ...prev,
      [index]: false,
    }))
  }

  const handleImageStart = (index: number) => {
    setIsLoading((prev) => ({
      ...prev,
      [index]: true,
    }))
  }

  return (
    <>
      {/* Grid Masonry Mejorado */}
      <div className="columns-1 gap-3 space-y-3 p-4 sm:columns-2 sm:gap-4 sm:space-y-4 lg:columns-3">
        {images.map((img, index) => {
          const isNearby =
            Math.abs(index - current) <= 1 ||
            Math.abs(index - current) >= images.length - 1
          return (
            <CarouselItem
              key={`carousel-${index}-${img.src}`}
              className="flex h-full items-center justify-center pl-0"
            >
              <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-8">
                <img
                  key={`img-${index}-${img.src}`}
                  src={img.src}
                  alt={img.fileName || `Foto ${index + 1}`}
                  className="h-auto max-h-[85vh] w-auto max-w-[95vw] rounded-lg object-contain shadow-2xl select-none sm:max-h-[90vh] sm:max-w-[90vw]"
                  draggable={false}
                  loading={isNearby ? 'eager' : 'lazy'}
                  style={{
                    margin: 'auto',
                  }}
                />
              </div>
            </CarouselItem>
          )
        })}
      </div>

      {/* Lightbox Mejorado */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-screen w-screen max-w-[100vw] flex-col items-center justify-center border-none bg-black/95 p-0 backdrop-blur-2xl outline-none [&>button:last-child]:hidden">
          <DialogTitle className="sr-only">
            Galería - Imagen {current + 1} de {images.length}
          </DialogTitle>

          {/* Header con contador y botón cerrar */}
          <div className="pointer-events-none absolute top-0 right-0 left-0 z-50 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6">
            <div className="pointer-events-auto text-sm font-medium text-white/90 sm:text-base">
              {current + 1} / {images.length}
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`pointer-events-auto h-10 w-10 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm${reducedMotion ? '' : 'transition-all duration-300'} hover:bg-white/20 sm:h-12 sm:w-12`}
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </DialogClose>
          </div>

          {/* Carrusel con mejor centrado */}
          <Carousel
            setApi={setApi}
            className="flex h-full w-full items-center justify-center"
            opts={{
              loop: true,
              align: 'center',
              watchDrag: true,
            }}
          >
            <CarouselContent className="-ml-0 h-full">
              {images.map((img, index) => {
                const isNearby =
                  Math.abs(index - current) <= 1 ||
                  Math.abs(index - current) >= images.length - 1
                return (
                  <CarouselItem
                    key={`carousel-${index}-${img.src}`}
                    className="flex h-full items-center justify-center pl-0"
                  >
                    <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-8">
                      <img
                        key={`img-${index}-${img.src}`}
                        src={img.src}
                        alt={img.fileName || `Foto ${index + 1}`}
                        className="h-auto max-h-[85vh] w-auto max-w-[95vw] rounded-lg object-contain shadow-2xl select-none sm:max-h-[90vh] sm:max-w-[90vw]"
                        draggable={false}
                        loading={isNearby ? 'eager' : 'lazy'}
                        style={{
                          margin: 'auto',
                        }}
                      />
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>

          {/* Botones de navegación - Desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollPrev}
            className={`absolute top-1/2 left-2 hidden h-12 w-12 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm${reducedMotion ? '' : 'transition-all duration-300 hover:scale-110'} hover:bg-white/20 sm:left-4 sm:h-14 sm:w-14 md:flex`}
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={scrollNext}
            className={`absolute top-1/2 right-2 hidden h-12 w-12 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm${reducedMotion ? '' : 'transition-all duration-300 hover:scale-110'} hover:bg-white/20 sm:right-4 sm:h-14 sm:w-14 md:flex`}
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>

          {/* Indicadores de navegación táctil - Mobile */}
          <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2 md:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrent(index)
                  api?.scrollTo(index)
                }}
                className={`h-2 rounded-full ${reducedMotion ? '' : 'transition-all duration-300'}${
                  index === current
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>

          {/* Nombre del archivo - Footer */}
          {images[current]?.fileName && (
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
              <p className="mx-auto max-w-2xl truncate text-center text-sm font-medium text-white/90 sm:text-base">
                {images[current].fileName}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
