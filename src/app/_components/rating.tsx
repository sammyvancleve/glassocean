import { Star, } from 'lucide-react'
import React, { SetStateAction, useEffect, useState, } from 'react'
import { cn, } from '~/lib/utils'

interface RatingProps {
  objectRating: number,
  updateRating: SetStateAction<number>
  className?: string
}

const Rating: React.FC<RatingProps> = ({ objectRating, updateRating, className, }) => {
  const [rating, setRating] = useState(objectRating ?? 0)
  console.log('objectRating', objectRating)
  console.log('rating', rating)

  const changeRating = (clickedRating: number) => {
    if (clickedRating === rating) {
      setRating(0)
    } else {
      setRating(clickedRating)
    }
  }

  useEffect(() => {
    console.log('new rating', objectRating)
    setRating(objectRating ?? 0)
  }, [objectRating])

  return (
    <div className={cn('flex items-center', className)}>
      {Array.from({ length: 5, }, (_, i) => {
        return (
          <div key={i} onClick={() => changeRating(i + 1)}>
            {i < rating ? (
              <Star className='fill-primary hover:scale-105' />
            ) : (
              <Star className='hover:scale-105' />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Rating