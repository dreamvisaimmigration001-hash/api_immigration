import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import 'dotenv/config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'immigration_documents',
    allowedFormats: ['jpg', 'png', 'jpeg', 'pdf'],
    // resource_type: 'auto' is needed to allow PDF uploads as raw/image depending on Cloudinary version, but usually 'auto' handles it well
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

export { cloudinary, upload };
