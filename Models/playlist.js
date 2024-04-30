const mongoose = require("mongoose")

const playlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    name :{
        type: String,
        require: [true, "Please provide playlist name"]

    },
    songs: [
        {
            id: {
                type: String,
                required: [true, "Please provide song id"]
            },
            download_Url: [
                {
                    quality:{type:String},
                    url:{type:String}
                }
            ],
            name: {
                type: String,
                required: [true, "Please provide song name"]
            },
            duration: {
                type: Number,
                required: [true, "Please provide duration of song"]
            },
            image: [
                {
                    quality: {type:String},
                    url: {type:String}
                },
            ],
            language: {
                type: String,
                require: [true, "Please provide language"]
            },
            artist: {
                type: String,
                require: [true, "Please provide artist"]
            }
        }
    ]
},{timestamps: true})

module.exports = mongoose.model("Playlist", playlistSchema)
