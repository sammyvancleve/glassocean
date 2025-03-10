import sharp from 'sharp'

const generatePreview = (image: Buffer<ArrayBufferLike>) => {
    const metadata = sharp(image).metadata()
    console.log('sharp metadata: ', metadata)
}

export default generatePreview