import sharp from 'sharp'
import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

export const processImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const fileName: string = req.query.fileName as string
  const width: number = parseInt(req.query.width as string)
  const height: number = parseInt(req.query.height as string)
  const imgPath: string =
    path.join(__dirname, '../../images/storage/') + `${fileName}.jpg`
  const filePath: string =
    path.join(__dirname, '../../images/output/') +
    `${fileName}_${width}_${height}.jpg`

  try {
    await fs.promises.readFile(imgPath, 'utf8')
  } catch (err: unknown) {
    res.status(400).send('image is not existed.')
  }

  try {
    await resizeImage(imgPath, width, height, filePath)

    res.status(200).sendFile(filePath)
  } catch (err: unknown) {
    res.status(400).send('failed to resize image.')
  }
}

export const resizeImage = async (
  imagePath: string,
  width: number,
  height: number,
  destinationPath: string,
): Promise<void> => {
  try {
    await sharp(imagePath)
      .resize(width, height, { fit: 'cover' })
      .toFile(destinationPath)
  } catch (err: unknown) {
    throw new Error('failed to resize image.')
  }
}
