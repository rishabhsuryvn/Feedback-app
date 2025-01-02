import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGO_URL) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URL"');
}

const uri = process.env.MONGO_URL;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client;

if (process.env.NODE_ENV === "development") {
  // Use a global variable to preserve the MongoClient instance across module reloads
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }
  client = global._mongoClient;
} else {
  // In production, create a new client instance
  client = new MongoClient(uri, options);
}

// Setting the database dynamically
const getDb = () => {
  const dbName =
    process.env.NODE_ENV === "development" ? "test" : process.env.DB_NAME;
  return client.db(dbName);
};

export default client;
export { getDb };
