import { processImage, resizeImage } from '../../src/handlers/imageHandler'
import { Request, Response } from 'express'
import sharp from 'sharp'

const mockResponse = (): Response => {
  const res = {} as Response
  res.status = jest.fn().mockReturnThis()
  res.send = jest.fn().mockReturnThis()
  res.sendFile = jest.fn()
  return res
}

jest.mock('sharp', () => {
  return jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(undefined),
  }))
})

describe('Test imageHandler', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('processImage_success', async () => {
    let request = {
      query: {
        fileName: 'fjord',
        width: '200',
        height: '200',
      },
    } as unknown as Request
    const expectedFilePath =
      'E:\\image-processing\\images\\output\\fjord_200_200.jpg'
    let response: Response = mockResponse()
    await processImage(request, response)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.sendFile).toHaveBeenCalledWith(expectedFilePath)
  })

  test('processImage_fileNotExist', async () => {
    let request = {
      query: {
        fileName: 'abc',
        width: '200',
        height: '200',
      },
    } as unknown as Request

    let response: Response = mockResponse()
    await processImage(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.send).toHaveBeenCalledWith('image is not existed.')
  })

  test('processImage_resizeFail', async () => {
    let request = {
      query: {
        fileName: 'fjord',
        width: 'abc',
        height: '200',
      },
    } as unknown as Request

    ;(sharp as unknown as jest.Mock).mockReturnValue({
      resize: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockRejectedValue(new Error('Sharp error')),
    })

    let response: Response = mockResponse()
    await processImage(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.send).toHaveBeenCalledWith('failed to resize image.')
  })

  test('resizeImage_success', async () => {
    const imagePath: string = 'E:\\image-processing\\images\\storage\\fjord.jpg'
    const destinationPath: string =
      'E:\\image-processing\\images\\output\\fjord_200_200.jpg'
    const width: number = 200
    const height: number = 200

    ;(sharp as unknown as jest.Mock).mockReturnValue({
      resize: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockReturnThis(),
    })

    await expect(
      resizeImage(imagePath, width, height, destinationPath),
    ).resolves.not.toThrow()
  })

  test('resizeImage_throwError', async () => {
    const imagePath: string = 'E:\\image-processing\\images\\storage\\fjord.jpg'
    const destinationPath: string =
      'E:\\image-processing\\images\\output\\fjord_200_200.jpg'
    const width: number = 200
    const height: number = 200

    ;(sharp as unknown as jest.Mock).mockReturnValue({
      resize: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockRejectedValue(new Error('Sharp error')),
    })

    await expect(
      resizeImage(imagePath, width, height, destinationPath),
    ).rejects.toThrow('failed to resize image.')
  })
})
