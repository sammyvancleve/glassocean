import React from 'react'
import clsx from 'clsx'

interface GalleryProps {
  children: React.ReactNode,
  columns?: number,
  className?: string
}

const GridGallery: React.FC<GalleryProps> = React.memo(({ children, columns = 4, className, }) => {
  const validChildren = React.Children.toArray(children).filter(React.isValidElement)
  console.log('validchildren', validChildren)
  const gridClass = clsx('grid gap-3 w-full', className, {
    'grid-cols-2': columns === 3,
    'grid-cols-3': columns === 3,
    'grid-cols-4': columns === 4,
    'grid-cols-5': columns === 5,
    'grid-cols-6': columns === 6,
    'grid-cols-7': columns === 7,
    'grid-cols-8': columns === 8,
  })

  return (
    <div className={gridClass}>
      {validChildren.map((item, itemIndex) => (
        <div key={`galleryitem-${itemIndex}`} className='col-span-1 last:mb-0'>
          {item}
        </div>
      ))}
    </div>
  )
})

export default GridGallery