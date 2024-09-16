import { NextFunction } from 'express'
import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

export const validateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fileName: string = req.query.fileName as string
  const width: string = req.query.width as string
  const height: string = req.query.height as string
  const digitRegex = /^\d+$/
  const alphabetRegex = /^[A-Za-z]+$/
  const filePath =
    path.join(__dirname, '../../images/output/') +
    `${fileName}_${width}_${height}.jpg`
  const messages = []
  if (fileName == undefined || fileName == '') {
    messages.push('fileName query is required.')
  } else if (!alphabetRegex.test(fileName)) {
    messages.push('fileName query only contains alphabet characters.')
  }

  if (width === undefined) {
    messages.push('width query is required.')
  } else if (!digitRegex.test(width)) {
    messages.push('width query must be number.')
  }

  if (height === undefined) {
    messages.push('height query is required.')
  } else if (!digitRegex.test(height)) {
    messages.push('height query must be number.')
  }

  if (messages.length) {
    res.status(400).send(messages)
    return
  }

  // Caching
  try {
    await fs.promises.readFile(filePath, 'utf8')
    res.status(200).sendFile(filePath)
  } catch (err) {
    next()
  }
}
