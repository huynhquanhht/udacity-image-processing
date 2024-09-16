import { NextFunction, Request, Response } from 'express'
import { validateMiddleware } from '../../src/middlewares/imageMiddleware'

const mockResponse = (): Response => {
  const response = {} as Response
  response.status = jest.fn().mockReturnThis()
  response.send = jest.fn().mockReturnThis()
  response.sendFile = jest.fn()
  return response
}
const mockNext = jest.fn() as NextFunction

test('validateMiddleware_validateRequired', async () => {
  let request = {
    query: {
      fileName: undefined,
      width: undefined,
      height: undefined,
    },
  } as unknown as Request
  const response = mockResponse()

  await validateMiddleware(request, response, mockNext)
  expect(response.status).toHaveBeenCalledWith(400)
  expect(response.send).toHaveBeenCalledWith([
    'fileName query is required.',
    'width query is required.',
    'height query is required.',
  ])
  expect(mockNext).not.toHaveBeenCalled()
})

test('validateMiddleware_validateFormat', async () => {
  let request = {
    query: {
      fileName: '!@#',
      width: 'acb',
      height: 'abc',
    },
  } as unknown as Request
  const response = mockResponse()

  await validateMiddleware(request, response, mockNext)
  expect(response.status).toHaveBeenCalledWith(400)
  expect(response.send).toHaveBeenCalledWith([
    'fileName query only contains alphabet characters.',
    'width query must be number.',
    'height query must be number.',
  ])
  expect(mockNext).not.toHaveBeenCalled()
})

test('validateMiddleware_successWithExistedFile', async () => {
  let request = {
    query: {
      fileName: 'fjord',
      width: '200',
      height: '200',
    },
  } as unknown as Request
  const response = mockResponse()
  const expectedFilePath =
    'E:\\image-processing\\images\\output\\fjord_200_200.jpg'

  await validateMiddleware(request, response, mockNext)
  expect(response.status).toHaveBeenCalledWith(200)
  expect(response.sendFile).toHaveBeenCalledWith(expectedFilePath)
  expect(mockNext).not.toHaveBeenCalled()
})
