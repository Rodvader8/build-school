// Compares two PNG pictures pixel by pixel.
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

/**
 * @param bufferA, bufferB  PNG files as Buffers
 * @param threshold         how different two colours must be to count (0 = any difference, 1 = never). 0.1 is a good start.
 * @returns { width, height, diffPixels, ratio, diffPng }  where ratio = diffPixels / (width * height) and diffPng is a Buffer,
 *          or { sizeMismatch: true } when the two pictures aren't the same size.
 */
export function compareImages(bufferA, bufferB, { threshold = 0.1 } = {}) {
  // TODO
  return { sizeMismatch: true };
}
