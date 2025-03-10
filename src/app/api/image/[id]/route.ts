import fs from 'fs'
import { PrismaClient, } from '@prisma/client'
import mime from 'mime-types'
import { NextResponse, } from 'next/server'

const prisma = new PrismaClient()

interface Params {
  params: { id: string }
}

export async function GET(request: Request, { params, }: Params) {
  console.log('API: /api/image/[id] - Request received')
  const { id, } = await params
  console.log('API: /api/image/[id] -  Received ID Param:', id)

  if (!id) {
    return new NextResponse('Missing image ID.', { status: 400, })
  }

  let imageId: number
  try {
    imageId = parseInt(id, 10)
    if (isNaN(imageId)) {
      throw new Error('Invalid image ID format')
    }
  } catch (error) {
    return new NextResponse('Invalid image ID format.', { status: 400, })
  }


  try {
    const imageRecord = await prisma.image.findUnique({where: { id: imageId, },})

    if (!imageRecord) {
      return new NextResponse('Image record not found.', { status: 404, })
    }

    const imagePathFromDB = imageRecord.imageUrl

    if (!imagePathFromDB) {
      return new NextResponse('Image path not found in database record.', { status: 400, })
    }

    const fullImagePath = imagePathFromDB


    if (!fs.existsSync(fullImagePath)) {
      return new NextResponse('Image file not found on server.', { status: 404, })
    }

    const contentType = mime.lookup(fullImagePath) || 'image/jpeg'

    const fileStream = fs.createReadStream(fullImagePath)

    return new NextResponse(fileStream as any, {
      status: 200,
      headers: {'Content-Type': contentType,},
    })


  } catch (error: any) {
    console.error('Error fetching image record:', error)
    return new NextResponse('Internal Server Error', { status: 500, })
  } finally {
    await prisma.$disconnect()
  }
}