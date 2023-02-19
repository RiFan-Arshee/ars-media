import express from 'express'
import {
    getUser,
    getUserFriend,
    addRemoveFriend
} from '../controllers/users.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.route('/:id')
    .get(verifyToken, getUser)

router.route('/:id/friends')
    .get(verifyToken, getUserFriend)

router.route('/:id/:friendId')
    .patch(verifyToken, addRemoveFriend)

export default router