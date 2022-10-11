
import cloudinary from "cloudinary";
//Cloudinary pic upload
cloudinary.config({
    cloud_name:'dvpfifnlb', //process.env.CLOUDINARY_NAME,
    api_key:'952342656364815', //process.env.CLOUDINARY_API_KEY,
    api_secret:'CguXDU9Y11gGNFlJfWl6rYyNfEw' //process.env.CLOUDINARY_API_SECRET,
  });

  export default cloudinary;