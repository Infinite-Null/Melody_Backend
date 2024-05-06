const displayError = require("../Formatters/displayError")
const { failResponse, successResponse } = require("../Formatters/displayResponse")
const Playlist = require("../Models/playlist")

exports.getUserPlaylist = async (req, res) => {
    const {userId} = req.user
   try{
    const playlists = await Playlist.find({user: userId}).select("-songs")
    successResponse(res, {playlists})
   }catch (e) {
    failResponse()
    displayError("Get User Playlist", e)
   }
}

exports.createPlaylist = async (req, res) => {
    const {userId} = req.user
    const {name} = req.body
    try{
     if(!name){
        failResponse(res, "Please provide name of playlist", 422)
     } else {
        const playlistWithProvidedName = Playlist.findOne({name})
        if(playlistWithProvidedName){
            failResponse(res,"Playlist Already Exists", 409)
        } else {
            const newPlaylist = new Playlist({
                user:userId,
                name:name,
                songs:[]
              })
              await newPlaylist.save()
              successResponse(res)   
        }
     }
    }catch (e) {
        failResponse()
        displayError("Get User Playlist", e)
    }
}

exports.deletePlaylist = async (req, res) => {
    const {userId} = req.user
    const {playlistId} = req.body
    try{
     if(!playlistId){
        failResponse(res, "Please provide id of playlist", 422)
     } else {
        const playlistWithProvidedId = await Playlist.findById(playlistId)
        if(playlistWithProvidedId){
            if(userId !== playlistWithProvidedId.user.toString()){
                failResponse(res, "Unauthorized", 401)
            } else {
                await Playlist.deleteOne({_id:playlistId})
                successResponse(res)
            }
        }else{
            failResponse(res,"No playlist found", 404)
        }
     }
    }catch (e) {
        failResponse(res)
        displayError("Get User Playlist", e)
    }
}

exports.updateNamePlaylist = async (req, res) => {
    const {userId} = req.user
    const {playlistId, updatedName} = req.body
    try{
     if(!playlistId || !updatedName){
        failResponse(res, "Please provide id of playlist and updated name", 422)
     } else {
        const playlistWithProvidedId = await Playlist.findById(playlistId)
        if(playlistWithProvidedId){
            if(userId !== playlistWithProvidedId.user.toString()){
                failResponse(res, "Unauthorized", 401)
            } else {
                await Playlist.updateOne({_id:playlistId},{name:updatedName})
                successResponse(res)
            }
        }else{
            failResponse(res,"No playlist found", 404)
        }
     }
    }catch (e) {
        failResponse(res)
        displayError("Get User Playlist", e)
    }
}

exports.addSongToPlaylist = async (req, res)=>{
    const {playlist_id} = req.params
    const {userId} = req.user
    const {song} = req.body
    try{
        if(playlist_id){
            const playlistWithProvidedId = await Playlist.findById(playlist_id)
            if(userId !== playlistWithProvidedId.user.toString()){
                failResponse(res, "Unauthorized", 401)
            } else {
                for(let i = 0; i<playlistWithProvidedId.songs.length; i++){
                    if(playlistWithProvidedId.songs[i].id === song.id){
                        failResponse(res,"Song already in playlist", 422)
                        return
                    }
                }
                playlistWithProvidedId.songs.push(song)
                await playlistWithProvidedId.save()
                successResponse(res)
            }
        } else {
            failResponse(res,"Provide playlist id", 422)
        }
    }catch (e){
        displayError("Add Song", e)
        failResponse(res)
    }
}

exports.getSongFromPlaylist = async(req , res) => {
    const {playlist_id} = req.params
    const {userId} = req.user
    try{
        if(playlist_id){
            const playlistWithProvidedId = await Playlist.findById(playlist_id)
            if(userId !== playlistWithProvidedId.user.toString()){
                failResponse(res, "Unauthorized", 401)
            } else {
                successResponse(res,{
                    success:true,
                    songs:playlistWithProvidedId.songs
                })
            }
        } else {
            failResponse(res,"Provide playlist id", 422)
        }
    }catch (e){
        displayError("Get Song", e)
        failResponse(res)
    }
}

exports.deleteSongFromPlaylist = async(req, res)=>{
    const {playlist_id} = req.params
    const {userId} = req.user
    const {songId} = req.body
    try{
        if(playlist_id && songId){
            const playlistWithProvidedId = await Playlist.findById(playlist_id)
            if(userId !== playlistWithProvidedId.user.toString()){
                failResponse(res, "Unauthorized", 401)
            } else {
                const newSongList = playlistWithProvidedId.songs.filter((e)=>e.id !== songId)
                playlistWithProvidedId.songs = newSongList
                await playlistWithProvidedId.save()
                successResponse(res)
            }
        } else {
            failResponse(res,"Provide playlist id and songId", 422)
        }
    }catch (e){
        displayError("Delete Song", e)
        failResponse(res)
    }
}