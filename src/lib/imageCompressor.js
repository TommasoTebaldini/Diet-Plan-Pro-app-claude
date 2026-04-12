/**
 * Client-side image compression using Canvas API.
 * Reduces image file size before uploading to Supabase Storage.
 *
 * @param {File} file - The original image file
 * @param {Object} options
 * @param {number} [options.maxWidth=1920]  - Max width in pixels
 * @param {number} [options.maxHeight=1920] - Max height in pixels
 * @param {number} [options.quality=0.8]    - JPEG quality (0-1)
 * @returns {Promise<File>} Compressed image as a File object
 */
export async function compressImage(file, options = {}) {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.8 } = options

  // Skip non-image files or very small files (< 100 KB)
  if (!file.type.startsWith('image/') || file.size < 100 * 1024) {
    return file
  }

  // Skip GIF images (they may be animated)
  if (file.type === 'image/gif') {
    return file
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)

      let { width, height } = img

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // Compression didn't help — return original
            resolve(file)
            return
          }
          const compressed = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(compressed)
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      // If we can't decode the image, return the original
      resolve(file)
    }

    img.src = URL.createObjectURL(file)
  })
}
