import { Media } from '@/payload-types'
import Image from 'next/image'
import { CrossCircledIcon } from '@radix-ui/react-icons'

interface ProductImageProps {
  className?: string
  image?:
    | string
    | Media
    | {
        useURL?: boolean | null
        imageUpload?: Media | string | null
        imageURL?: string | null
      }
    | null
  alt?: string
  size?: keyof Media['sizes'] | 'original'
  defaultWidth?: number
  defaultHeight?: number
  objectFit?:
    | 'object-cover'
    | 'object-contain'
    | 'object-fill'
    | 'object-none'
    | 'object-scale-down'
  priority?: boolean
}

const validateImageUrl = (src: string | null | undefined): string | null => {
  return typeof src === 'string' && (src.startsWith('http') || src.startsWith('/')) ? src : null
}

const ImageComponent = ({
  image,
  alt = 'Product Image',
  size = 'original',
  defaultWidth = 500,
  defaultHeight = 500,
  className,
  objectFit = 'object-cover',
}: ProductImageProps) => {
  if (!image) {
    return <ErrorDisplay message="No image provided." />
  }

  let imageUrl: string | null = null

  if (typeof image === 'string') {
    imageUrl = validateImageUrl(image)
  } else if (typeof image === 'object' && 'useURL' in image) {
    if (image.useURL && image.imageURL) {
      imageUrl = validateImageUrl(image.imageURL)
    } else if (
      image.imageUpload &&
      typeof image.imageUpload === 'object' &&
      'url' in image.imageUpload &&
      typeof image.imageUpload.url === 'string'
    ) {
      const media = image.imageUpload as Media
      const selectedSize = size === 'original' ? media : media.sizes?.[size]
      imageUrl = validateImageUrl(selectedSize?.url || media.url)
    }
  } else if ('url' in image && typeof image.url === 'string') {
    const selectedSize = size === 'original' ? image : image.sizes?.[size]
    imageUrl = validateImageUrl(selectedSize?.url || image.url)
  }

  if (!imageUrl) {
    return <ErrorDisplay message="Invalid image URL." />
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={defaultWidth}
      height={defaultHeight}
      className={`w-fit mx-auto h-full ${objectFit} ${className}`}
      priority
    />
  )
}


// Error Display Component (Still Server-Compatible)
const ErrorDisplay = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg border border-red-400">
      <CrossCircledIcon className="text-red-500 w-8 h-8 mb-2" />
      <p className="text-red-600 font-medium">{message}</p>
    </div>
  )
}

export default ImageComponent
