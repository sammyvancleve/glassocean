import { describe, it, expect } from "vitest";
import { readPngMetadata } from "~/utils/pngMetadataReader";

describe.skip('ExifReader package', () => {
    it('successfully reads from file path', () => {
        expect(readPngMetadata('path/to/some/test/file')).not.toThrowError()
    })
})