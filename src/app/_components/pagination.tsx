'use client'

import { ChevronLeft, ChevronRight, } from 'lucide-react'
import { Button, } from '~/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange, }: PaginationProps) => {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        end = 4
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push(-1) // -1 represents ellipsis
      }

      // Add page numbers
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push(-2) // -2 represents ellipsis
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='text-sm text-muted-foreground'>
        Page {currentPage} of {totalPages}
      </div>
      <div className='flex items-center space-x-2'>
        <Button variant='outline' size='icon' onClick={handlePrevious} disabled={!canGoPrevious}>
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only'>Previous page</span>
        </Button>

        <div className='flex items-center'>
          {getPageNumbers().map((page, index) => {
            if (page < 0) {
              // Render ellipsis
              return (
                <span key={`ellipsis-${index}`} className='px-2'>
                  ...
                </span>
              )
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size='icon'
                className='h-8 w-8'
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            )
          })}
        </div>

        <Button variant='outline' size='icon' onClick={handleNext} disabled={!canGoNext}>
          <ChevronRight className='h-4 w-4' />
          <span className='sr-only'>Next page</span>
        </Button>
      </div>
    </div>
  )
}

export default Pagination