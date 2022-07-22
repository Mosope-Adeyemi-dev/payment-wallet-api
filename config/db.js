const mongoose = require('mongoose');

const uri =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI_CLOUD
    : process.env.MONGODB_URI;

exports.connectDB = async () => {
  await mongoose
    .connect(uri)
    .then(() => {
      console.log('DB connected.');
    })
    .catch((error) => {
      console.log(`Error connecting to database /n ${error}`);
      throw new Error(error);
    });
};

exports.closeDBConnection = () => {
  return mongoose.disconnect();
};
