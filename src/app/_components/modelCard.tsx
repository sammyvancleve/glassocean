import * as React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Model, } from '@prisma/client'

interface ModelCardProps {
  model: Model
}
  
const ModelCard: React.FC<ModelCardProps> = React.memo(({ model, }) => {
  return (
    <Card className='col-span-1'>
      <CardHeader>
        <CardTitle>{model.name}</CardTitle>
        <CardDescription>{model.base}</CardDescription>
      </CardHeader>
      <CardContent>

      </CardContent>
      <CardFooter className='flex justify-between'>
      </CardFooter>
    </Card>
  )
})

export default ModelCard