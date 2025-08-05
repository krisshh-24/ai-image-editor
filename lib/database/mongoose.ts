import  { Mongoose } from 'mongoose'

const MONGODB_URL=process.env.MONGODB_URL;

interface MongodbConnection{
    conn:Mongoose | null;
    promise:Promise<Mongoose> | null;
}

declare global{
    var mongooseConnection:MongodbConnection | undefined;
}

let cached= global.mongooseConnection;
if(!cached){
    cached=global.mongooseConnection={ conn:null, promise:null};
}

export const connectToDatabase=async ():Promise<Mongoose>=>{
    if(cached?.conn) return cached?.conn;
    if(!MONGODB_URL) throw new Error('MOGNODB_URL is not defined')
    cached!.promise=cached!.promise|| import('mongoose').then((mongoose)=>{
        return mongoose.connect(MONGODB_URL)
    })
    cached!.conn =await cached!.promise;
    return cached!.conn;
}