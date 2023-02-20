import express from "express"
import bodyParser from "body-parser"
import cors from 'cors'
import { config } from 'dotenv'
import multer from "multer"
import helmet from 'helmet'
import morgan from "morgan"
import path from 'path'
import { fileURLToPath } from 'url'
import connect from './config/config.js'
import { register } from './controllers/auth.js'
import { createPost } from './controllers/posts.js'
import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { verifyToken } from "./middleware/auth.js"

config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const PORT = process.env.PORT || 8080

// Middlewares
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// File Storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })

// Routes
app.post('/auth/register', upload.single('picture'), register)
app.post('/posts', verifyToken, upload.single('picture'), createPost)

// Middlewares Routes
app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/posts', postRoutes)

// Initialize Server and Database
async function start() {
    try {
        await connect(process.env.MONGO_URL)
        app.listen(PORT, console.log(`Server running on port: ${PORT}`))
    } catch (err) {
        console.error(err);
    }
}

start()