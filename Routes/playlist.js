const express = require('express')
const isAuththenticatedUser = require('../Middleware/CheckUserLogin')
const { getUserPlaylist, createPlaylist, deletePlaylist, updateNamePlaylist, addSongToPlaylist, getSongFromPlaylist, deleteSongFromPlaylist } = require('../Controller/playlist')
const router = express.Router()

router.route("/playlist")
.get(isAuththenticatedUser, getUserPlaylist)
.post(isAuththenticatedUser, createPlaylist)
.delete(isAuththenticatedUser, deletePlaylist)
.patch(isAuththenticatedUser, updateNamePlaylist)

router.route("/song/:playlist_id")
.post(isAuththenticatedUser,addSongToPlaylist)
.get(isAuththenticatedUser,getSongFromPlaylist)
.delete(isAuththenticatedUser,deleteSongFromPlaylist)

module.exports = router
