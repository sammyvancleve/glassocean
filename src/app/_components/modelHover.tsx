import { Model, } from '@prisma/client'
import { Box, Boxes, Weight, } from 'lucide-react'
import { Button, } from '~/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '~/components/ui/hover-card'


interface ModelHoverProps {
  model: Model,
  type: 'main' | 'lora',
  weight?: number,
  onModelClick: () => void,
}
  
const ModelHover: React.FC<ModelHoverProps> = ({
  model, type, weight, onModelClick, 
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant='outline' className='w-full' onClick={onModelClick}>
          {type === 'main' && <Box />}
          {type === 'lora' && <Boxes />}
          {model.name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-full'>
        <div>
          <p>{model.base}</p>
          {type === 'lora' 
                && <div className='flex items-center text-sm'>
                  <Weight className='h-4 w-5 m-r-1'/>
                  <p>{weight}</p>
                </div>
          }
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default ModelHover