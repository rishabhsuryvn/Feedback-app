const { default: mongoose } = require("mongoose");

const ConnectMongo = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("mongo connected");
  }
};
export default ConnectMongo;
