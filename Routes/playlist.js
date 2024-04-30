const express = require('express')
const isAuththenticatedUser = require('../Middleware/CheckUserLogin')
const { getUserPlaylist, createPlaylist, deletePlaylist, updateNamePlaylist } = require('../Controller/playlist')
const router = express.Router()

router.route("/playlist")
.get(isAuththenticatedUser, getUserPlaylist)
.post(isAuththenticatedUser, createPlaylist)
.delete(isAuththenticatedUser, deletePlaylist)
.patch(isAuththenticatedUser, updateNamePlaylist)

module.exports = router
