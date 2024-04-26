const connectDb = require("./Utils/connectDb")
const app = require("./app")
app.listen(process.env.PORT, () => {
    connectDb()
    console.log(`Server is running in PORT: 3000`)
})
