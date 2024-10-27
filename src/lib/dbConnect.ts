import mongoose from 'mongoose' 

type ConnectionObject = {
    isConnected?: number 
}

const connection: ConnectionObject = {}
const DB_NAME = "career_recomendation"

async function dbConnect() : Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to database")
        return
    }

    try {
       const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`|| '' , {})
       connection.isConnected = db.connections[0].readyState

       console.log("database connected")
    } catch (error) {
        
        console.log("Database connection failed" ,error)

        process.exit(1)
    }
}

export default dbConnect;