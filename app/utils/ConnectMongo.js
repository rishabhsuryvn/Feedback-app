const { default: mongoose } = require("mongoose");

const ConnectMongo = async () => {
  const dbName = process.env.DB_NAME || "devDB";
  if (mongoose.connection.readyState === 0) {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${dbName}`
    );
    console.log(dbName);
    console.log(
      `Connected to Mongo! Database Host: "${connectionInstance?.connection.host}" Database Name: "${connectionInstance?.connection.db.databaseName}"`
    );
  }
};

export default ConnectMongo;
