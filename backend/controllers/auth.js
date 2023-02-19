import bcrypt from 'bcrypt'
import jwt  from 'jsonwebtoken'
import User from '../models/User.js'

export async function register(req, res) {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body

        const hashedPassword = await bcrypt.hash(password, 20)
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            imporessions: Math.floor(Math.random() * 10000)
        })

        const savedUser = await newUser.save()
        res.status(201).json(savedUser)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) return res.status(400).json({ msg: 'User does not exist.'})

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: 'Email or Password is wrong.'})

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        delete user.pasword
        res.status(200).json({ token, user })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}