import { processImage, resizeImage } from '../../src/handlers/imageHandler'
import { Request, Response } from 'express'

const mockResponse = (): Response => {
  const res = {} as Response
  res.status = jest.fn().mockReturnThis()
  res.send = jest.fn().mockReturnThis()
  res.sendFile = jest.fn()
  return res
}

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

  let response: Response = mockResponse()
  await processImage(request, response)

  expect(response.status).toHaveBeenCalledWith(400)
  expect(response.send).toHaveBeenCalledWith('failed to resize image.')
})
