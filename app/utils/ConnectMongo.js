const { default: mongoose } = require("mongoose");

const ConnectMongo = async () => {
  if (mongoose.connection.readyState === 0) {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to Mongo! Database Host: "${connectionInstance?.connection.host}" Database Name: "${connectionInstance?.connection.db.databaseName}"`
    );
  }
};
export default ConnectMongo;
