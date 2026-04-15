#!/usr/bin/env node
// Run: node generate-icons.js
// Generates all required PWA icon sizes as PNG files (no external dependencies)

import zlib from 'zlib'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

// Brand colors: #0d5c3a → #2da06e gradient approximated as midpoint #1a7f5a
const BG_R = 26, BG_G = 127, BG_B = 90      // #1a7f5a (green background)
const FG_R = 255, FG_G = 255, FG_B = 255    // white leaf

function uint32BE(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32BE(n >>> 0)
  return b
}

function crc32(buf) {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    t[n] = c
  }
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = t[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const tb = Buffer.from(type, 'ascii')
  const combined = Buffer.concat([tb, data])
  return Buffer.concat([uint32BE(data.length), combined, uint32BE(crc32(combined))])
}

// Returns true if pixel (x,y) in a size×size icon is inside the leaf shape
function isLeaf(x, y, size) {
  const cx = size / 2, cy = size / 2
  const lh = size * 0.60
  // Normalise to [-1, 1] range relative to leaf bounding box
  const nx = (x - cx) / (lh * 0.45)
  const ny = (y - cy) / (lh * 0.5)
  // Leaf: ellipse-like shape |nx| < sqrt(1 - ny²)
  if (Math.abs(ny) > 1) return false
  return Math.abs(nx) < Math.sqrt(1 - ny * ny) * 0.85
}

function isVein(x, y, size) {
  const cx = size / 2, cy = size / 2
  const lh = size * 0.60
  const ny = (y - cy) / (lh * 0.5)
  if (Math.abs(ny) > 0.9) return false
  return Math.abs(x - cx) < Math.max(1, size * 0.018)
}

function createIconPNG(size) {
  const raw = Buffer.alloc(size * (1 + size * 3))

  for (let y = 0; y < size; y++) {
    const rowOff = y * (1 + size * 3)
    raw[rowOff] = 0 // filter type None
    for (let x = 0; x < size; x++) {
      const off = rowOff + 1 + x * 3
      const leaf = isLeaf(x, y, size)
      const vein = leaf && isVein(x, y, size)

      if (vein) {
        // Darker green vein line
        raw[off]     = Math.round(BG_R * 0.6)
        raw[off + 1] = Math.round(BG_G * 0.6)
        raw[off + 2] = Math.round(BG_B * 0.6)
      } else if (leaf) {
        raw[off]     = FG_R
        raw[off + 1] = FG_G
        raw[off + 2] = FG_B
      } else {
        // Background: simple top-left → bottom-right gradient from #0d5c3a to #2da06e
        const t = (x + y) / (2 * size)
        raw[off]     = Math.round(13  + (45  - 13)  * t)  // R: 0d → 2d
        raw[off + 1] = Math.round(92  + (160 - 92)  * t)  // G: 5c → a0
        raw[off + 2] = Math.round(58  + (110 - 58)  * t)  // B: 3a → 6e
      }
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // RGB
  // bytes 10-12 are 0 (compression, filter, interlace)

  const idat = zlib.deflateSync(raw)
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

const iconsDir = path.join(__dirname, 'public', 'icons')
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true })

SIZES.forEach(size => {
  const buf = createIconPNG(size)
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), buf)
  console.log(`✓ icon-${size}x${size}.png`)
})
console.log('\nAll icons generated in public/icons/')
