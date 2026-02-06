import mongoose from 'mongoose';

  const connect_mongodb = async() => {
    try {
     await mongoose.connect(process.env.MONGODB_URL);
     console.log("mongodb connected");
    } catch(err) {
      console.log("mongodb error");
    }
  } 
  export default connect_mongodb;