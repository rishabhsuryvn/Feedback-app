const { default: mongoose } = require("mongoose");

const ConnectMongo = async () => {
  try {
    const dbName = process.env.DB_NAME || "devDB";
    const dbUrl = process.env.MONGO_URL + "/" + dbName;
    const connectionInstance = await mongoose.connect(dbUrl);
    console.log(dbUrl);
    console.log(
      `Connected to Mongo! Database Host: "${connectionInstance?.connection.host}" Database Name: "${connectionInstance?.connection.db.databaseName}"`
    );
  } catch (error) {
    console.log(error);
  }
};

export default ConnectMongo;
