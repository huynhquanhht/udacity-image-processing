import { NextFunction } from 'express'
import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

export const validateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const fileName: string = req.query.fileName as string
  const width: string = req.query.width as string
  const height: string = req.query.height as string
  const positiveNumberRegex: RegExp = /^[1-9]\d*$/
  const alphabetRegex: RegExp = /^[A-Za-z]+$/
  const filePath: string =
    path.join(__dirname, '../../images/output/') +
    `${fileName}_${width}_${height}.jpg`
  const messages: string[] = []
  if (fileName == undefined || fileName == '') {
    messages.push('fileName query is required.')
  } else if (!alphabetRegex.test(fileName)) {
    messages.push('fileName query only contains alphabet characters.')
  }

  if (width === undefined) {
    messages.push('width query is required.')
  } else if (!positiveNumberRegex.test(width)) {
    messages.push('width query must be positive number.')
  }

  if (height === undefined) {
    messages.push('height query is required.')
  } else if (!positiveNumberRegex.test(height)) {
    messages.push('height query must be positive number.')
  }

  if (messages.length) {
    res.status(400).send(messages)
    return
  }

  // Caching
  try {
    await fs.promises.readFile(filePath, 'utf8')
    res.status(200).sendFile(filePath)
  } catch (err: unknown) {
    next()
  }
}
