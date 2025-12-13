import * as React from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

interface ImageAsset {
  src: string;
  fileName?: string;
  width?: number;
  height?: number;
}

interface GalleryViewerProps {
  images: ImageAsset[];
}

export function GalleryViewer({ images }: GalleryViewerProps) {
  const [open, setOpen] = React.useState(false)
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()
  const [isLoading, setIsLoading] = React.useState<Record<number, boolean>>({})

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

    api.on("select", handleSelect)
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!open || !api) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        api.scrollPrev()
        setTimeout(() => setCurrent(api.selectedScrollSnap()), 50)
      }
      if (e.key === "ArrowRight") {
        api.scrollNext()
        setTimeout(() => setCurrent(api.selectedScrollSnap()), 50)
      }
      if (e.key === "Escape") setOpen(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
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
    setIsLoading(prev => ({
      ...prev,
      [index]: false
    }))
  }

  const handleImageStart = (index: number) => {
    setIsLoading(prev => ({
      ...prev,
      [index]: true
    }))
  }

  return (
    <>
      {/* Grid Masonry Mejorado */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4 p-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="break-inside-avoid relative group rounded-xl overflow-hidden border border-border/40 bg-card shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
            onClick={() => {
              setCurrent(index)
              setOpen(true)
            }}
          >
            {/* Skeleton loader sutil */}
            {isLoading[index] && (
              <div className="absolute inset-0 bg-muted/50" />
            )}
            
            <img
              src={img.src}
              alt={img.fileName || `Foto ${index + 1}`}
              className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110"
              loading="lazy"
              draggable={false}
              onLoadStart={() => handleImageStart(index)}
              onLoad={() => handleImageLoad(index)}
            />
            
            {/* Overlay con efecto de zoom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-between p-4">
              <span className="text-white text-sm font-medium truncate">
                {img.fileName || `Foto ${index + 1}`}
              </span>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <ZoomIn className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Mejorado */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[100vw] w-screen h-screen p-0 border-none bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center outline-none [&>button:last-child]:hidden"
        >
          <DialogTitle className="sr-only">
            Galería - Imagen {current + 1} de {images.length}
          </DialogTitle>

          {/* Header con contador y botón cerrar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <div className="text-white/90 text-sm sm:text-base font-medium pointer-events-auto">
              {current + 1} / {images.length}
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="pointer-events-auto rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 transition-all duration-300 h-10 w-10 sm:h-12 sm:w-12"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </DialogClose>
          </div>

          {/* Carrusel con mejor centrado */}
          <Carousel 
            setApi={setApi} 
            className="w-full h-full flex items-center justify-center"
            opts={{
              loop: true,
              align: "center",
              watchDrag: true
            }}
          >
            <CarouselContent className="h-full -ml-0">
              {images.map((img, index) => (
                <CarouselItem 
                  key={`carousel-${index}-${img.src}`}
                  className="h-full flex items-center justify-center pl-0"
                >
                  <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                    <img
                      key={`img-${index}-${img.src}`}
                      src={img.src}
                      alt={img.fileName || `Foto ${index + 1}`}
                      className="max-h-[85vh] max-w-[95vw] sm:max-h-[90vh] sm:max-w-[90vw] w-auto h-auto object-contain shadow-2xl rounded-lg select-none"
                      draggable={false}
                      loading="eager"
                      style={{
                        margin: 'auto'
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Botones de navegación - Desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 hidden md:flex h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={scrollNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 hidden md:flex h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>

          {/* Indicadores de navegación táctil - Mobile */}
          <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrent(index)
                  api?.scrollTo(index)
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
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
            <div className="absolute bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
              <p className="text-white/90 text-sm sm:text-base text-center font-medium truncate max-w-2xl mx-auto">
                {images[current].fileName}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}