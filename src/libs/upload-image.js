import  cloudinary from "./cloudinary";

export async function uploadImage(file,folder){

    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    return new Promise(async(resolve,reject)=>{
        await cloudinary.uploader.upload_stream({
            resource_type:"auto",
            folder:folder,
        },async(err,result)=>{
            if(err)
            {
                reject(err.message);
            }            
                resolve(result);            
 
        }).end(bytes);
    })
}

export async function DeleteImage(public_id){

    return new Promise(async(resolve,reject)=>{
        try {
            
            const result = await cloudinary.uploader.destroy(
                public_id
            );
            return resolve(result);
        } catch (error) {
            reject(new Error(error.message))
        }
    })
};

export async function updateImage(newImage, oldImagePublicId, folder) {
    try {
      // If there's an old image, delete it from Cloudinary
      if (oldImagePublicId) {
        const deleteResult = await DeleteImage(oldImagePublicId);
        console.log('Old image deleted from Cloudinary:', deleteResult);
      }
  
      // Upload the new image to Cloudinary
      const imageUploadResult = await uploadImage(newImage, folder);
      console.log('New image uploaded to Cloudinary:', imageUploadResult);
  
      return imageUploadResult;
    } catch (error) {
      console.error('Error updating image:', error.message);
      throw new Error('Failed to update the image.');
    }
  }

  export async function uploadImage21(file, folder) {
    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: folder },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        // Convert the buffer to a readable stream and pipe it to Cloudinary
        bufferToStream(buffer).pipe(uploadStream);
    });
}

