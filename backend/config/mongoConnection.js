import { MongoClient } from "mongodb";

let _connection = undefined;
let _database = undefined;

const mongoConfig = {
  serverUrl: process.env.MONGO_URI || "mongodb://localhost:27017/",
  database: "portion-patrol",
};

const databaseConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _database = _connection.db(mongoConfig.database);
  }

  return _database;
};

const closeConnection = async () => {
  await _connection.close();
};

export { databaseConnection, closeConnection };
