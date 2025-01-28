import grid from 'gridfs-stream';
import mongoose from 'mongoose';

const url = 'https://chatify-server-nn6o.onrender.com';

let gfs, gridFsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs'
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('fs');
})

export const uploadFile = (request, response) => { 
    if(!request.file) 
        return response.status(404).json("File not found");
    
    const imageUrl = `${url}/file/${request.file.filename}`;

    response.status(200).json(imageUrl);    
}

export const getImage = async (request, response) => {
    try{
        const file = await gfs.files.findOne({filename: request.params.filename});

        const reaStream = gridFsBucket.openDownloadStream(file._id);
        reaStream.pipe(response);
    } catch(error){
        return response.status(500).json(error.message);
    }
}