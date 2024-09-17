import app from '../src/index'
import supertest from 'supertest'
const request = supertest(app)

describe('Test endpoint', () => {
  afterAll(done => {
    done()
  })
  it('Get images success', async () => {
    const response = await request.get(
      '/image?fileName=fjord&width=300&height=300',
    )
    expect(response.status).toBe(200)
  })

  it('Get images fail', async () => {
    const response = await request.get(
      '/image?fileName=fjord&width=a&height=300',
    )
    expect(response.status).toBe(400)
    expect(response.body).toEqual(['width query must be positive number.'])
  })
})
