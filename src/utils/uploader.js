

import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
export const Upload= async({photo})=>{
    try {
        // const upload = await cloudinary.uploader.upload(data.pic[0].path)
        // console.log(upload)
        // return upload
        console.log('hii')
    } catch (error) {
        console.log(error.message)
        throw new Error('Upload failed')
    }
}