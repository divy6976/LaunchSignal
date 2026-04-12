const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dnvuq9zzt',
    api_key: '782443696514368',
    api_secret: 'I-dRUX2oGoETfTiwgXZXG0YJhAI'
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        return response;
    } catch (error) {
        try {
            if (localFilePath && fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        } catch (_) {}
        return null;
    }
};

module.exports = uploadOnCloudinary;
