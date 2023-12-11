const mongoose = require('mongoose');

exports.connectDB = async () => {
  mongoose.set('strictQuery', true);
  await mongoose
    .connect(process.env.MONGODB_URI_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
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
