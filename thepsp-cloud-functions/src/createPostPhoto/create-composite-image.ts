import { spawn as spawnChildProcess } from 'node:child_process'
import { logger } from 'firebase-functions'

const spawn = (command: string, args: string[]) => {
  return new Promise((resolve, reject) => {
    const process = spawnChildProcess(command, args)

    process.on('close', (code) => {
      if (code === 0) {
        resolve(code)
      } else {
        reject(new Error(`Process exited with code ${code}`))
      }
    })

    process.on('error', reject)
  })
}

const goldenRatio = 1.61803398875
const photoWidth = 108
const photoHeight = 148
const logoHeight = 123
const padding = Math.round(photoWidth / goldenRatio / 2)
const halfPadding = Math.round(padding / 2)

const widthOfPhotos = photoWidth * 3 + padding * 2
const photoSideMargin = Math.round(widthOfPhotos / goldenRatio / 2)

const imageWidth = widthOfPhotos + photoSideMargin * 2
const imageHeight = imageWidth
const imageSize = `${imageWidth}x${imageHeight}`

const dateFontSize = 24
const prayingFontSize = 36
const leaderFontSize = 18

const photo1X = photoSideMargin
const photo2X = photoSideMargin + photoWidth + padding
const photo3X = photoSideMargin + photoWidth + padding + photoWidth + padding

const dateY = padding + halfPadding
const photosY = dateY + dateFontSize + halfPadding
const prayingTextY = photosY + photoHeight + padding
const leader1TextY = prayingTextY + prayingFontSize + halfPadding
const leader2TextY = leader1TextY + leaderFontSize + halfPadding
const leader3TextY = leader2TextY + leaderFontSize + halfPadding
const logoY = leader3TextY + leaderFontSize + halfPadding
const urlY = logoY + logoHeight

const photo1Geo = `+${photo1X}+${photosY}`
const photo2Geo = `+${photo2X}+${photosY}`
const photo3Geo = `+${photo3X}+${photosY}`
const logoGeo = `+${0}+${logoY}`

interface TextContent {
  fullDate: string
  praying: string
  leader1: string
  leader2: string
  leader3: string
  url: string
}

const placeText = async (
  image: string,
  text: string,
  yPosition: number,
  fontSize: number,
  color = 'white',
  font = 'Arial',
) => {
  const args = [
    image,
    '-background',
    'none',
    '-fill',
    color,
    '-gravity',
    'north',
    '-pointsize',
    fontSize,
    '-font',
    font,
    '-annotate',
    `+0+${yPosition}`,
    text,
    image,
  ].map((option) => option.toString())

  return spawn('convert', args)
}

export const createCompositeImage = async (
  photo1: string,
  photo2: string,
  photo3: string,
  logo: string,
  text: TextContent,
  color: string,
  image: string,
) => {
  logger.info(`Creating image!!!`)
  // create background
  try {
    await spawn('convert', ['-size', imageSize, 'xc:black', image])
  } catch (error) {
    logger.error(`Error creating background: ${error}`)
    console.error(`Error creating background: ${error}`)
  }
  // await spawn('convert', ['-size', imageSize, 'xc:black', image])
  // add photos
  logger.info(`Adding photos`)
  await spawn('composite', ['-geometry', photo1Geo, photo1, image, image])
  await spawn('composite', ['-geometry', photo2Geo, photo2, image, image])
  await spawn('composite', ['-geometry', photo3Geo, photo3, image, image])
  // add text
  logger.info(`Adding text`)
  await placeText(image, text.fullDate, dateY, dateFontSize)
  await placeText(
    image,
    text.praying,
    prayingTextY,
    prayingFontSize,
    color,
    'arial-bold',
  )
  await placeText(image, text.leader1, leader1TextY, leaderFontSize, 'khaki')
  await placeText(image, text.leader2, leader2TextY, leaderFontSize, 'khaki')
  await placeText(image, text.leader3, leader3TextY, leaderFontSize, 'khaki')
  // add logo
  await spawn('composite', [
    '-gravity',
    'north',
    '-geometry',
    logoGeo,
    logo,
    image,
    image,
  ])
  await placeText(image, text.url, urlY, leaderFontSize, 'darkorange')
  // add border
  await spawn('convert', ['-border', '16', '-bordercolor', color, image, image])
  await spawn('convert', [
    '-border',
    '9',
    '-bordercolor',
    'black',
    image,
    image,
  ])
}
