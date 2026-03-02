#!/usr/bin/env node
/**
 * Converts all PNG/JPEG/JPG images in src/images to WebP format.
 * Run once: node scripts/convert-to-webp.cjs
 * After running, update imports in TSX files from .png/.jpg/.jpeg to .webp
 */
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const imagesDir = path.join(__dirname, '../src/images')
const extensions = ['.png', '.jpg', '.jpeg']

async function convertAll() {
  const files = fs.readdirSync(imagesDir)

  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!extensions.includes(ext)) continue

    const inputPath = path.join(imagesDir, file)
    const outputName = path.basename(file, ext) + '.webp'
    const outputPath = path.join(imagesDir, outputName)

    if (fs.existsSync(outputPath)) {
      console.log(`  skip  ${file} → ${outputName} (already exists)`)
      continue
    }

    const inputStat = fs.statSync(inputPath)
    await sharp(inputPath)
      .webp({ quality: 82, effort: 5 })
      .toFile(outputPath)

    const outputStat = fs.statSync(outputPath)
    const savings = (((inputStat.size - outputStat.size) / inputStat.size) * 100).toFixed(1)
    console.log(
      `  ✓  ${file} (${(inputStat.size / 1024).toFixed(1)} KB) → ${outputName} (${(outputStat.size / 1024).toFixed(1)} KB)  saved ${savings}%`
    )
  }
}

convertAll().catch(console.error)
