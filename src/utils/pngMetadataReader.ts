import * as ExifReader from 'exifreader';
import * as fs from 'fs'
import xxhash from "xxhash-wasm"
import { Prisma } from '@prisma/client';
import { TestImageCreateInput } from './scanFolder';
import generatePreview from './previewGenerator';

type InvokeMetadata = {
    generation_mode: string
    positive_prompt: string,
    negative_prompt?: string,
    width: number,
    height: number,
    seed: number,
    model: Prisma.ModelCreateInput,
    loras: Prisma.ModelCreateInput[],
    app_version: string,
}

export const readPngMetadata = async (imagePath: string) => {
    await fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log('No read access to the file');
        } else {
            console.log('File is accessible');
        }
    });
    try {
        const createdAt = fs.statSync(imagePath).birthtime
        const imageBuffer = await fs.promises.readFile(imagePath)
        generatePreview(imageBuffer)

        const { create32, } = await xxhash();
        const hash = create32().update(new Uint8Array(imageBuffer)).digest().toString()

        const tags = await ExifReader.load(imageBuffer)
        let pngMetadata = {
            seed: '',
            prompt: '',
            model: {
                key: '',
                hash: '',
                name: '',
                base: '',
                type: ''
            }
        }
        if (Object.hasOwn(tags, 'invokeai_metadata')) {
            // const invokeMetadata = tags['invokeai_metadata']?.value
            // return JSON.parse(invokeMetadata?.toString() ?? '')
            const invokeMetadata = JSON.parse(tags['invokeai_metadata']?.value.toString() ?? '')
            console.log('invokeMetadata', invokeMetadata)
            pngMetadata = readInvokePngMetadata(invokeMetadata)
        }
        const objectForDb: TestImageCreateInput = {
            ...pngMetadata,
            promptLowerCase: pngMetadata.prompt.toLowerCase(),
            hash: hash,
            imageUrl: imagePath,
            createdAt: createdAt
        }
        return objectForDb
    } catch (e) {
        console.error(e)
        return null
    }
}

//map positive_prompts to prompts?

const readInvokePngMetadata = (metadata: InvokeMetadata) => {
    // console.log('asdfasdf', {
    //     ...metadata,
    //     prompt: metadata.positive_prompt,
    //     negativePrompt: metadata.negative_prompt,
    // })
    if (metadata.seed === undefined) {
        return null
    }
    return {
        //...metadata
        seed: metadata.seed.toString(),
        prompt: metadata.positive_prompt,
        model: metadata.model,
        loras: metadata.loras,
        promptLowerCase: metadata.positive_prompt.toLowerCase(),
        negativePrompt: metadata.negative_prompt,
    }
}