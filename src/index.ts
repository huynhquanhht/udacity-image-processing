import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { validateMiddleware } from './middlewares/imageMiddleware'
import { processImage } from './handlers/imageHandler'
import { Express } from 'express-serve-static-core'

const app: Express = express()
const port: string = process.env.PORT || '3000'
app.use(cors())

app.use('/image', validateMiddleware, processImage)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

export default app
