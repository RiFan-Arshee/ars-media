import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

function connect(url) {
    return mongoose.connect(url)
}

export default connect