import { MongoClient, ServerApiVersion } from "mongodb";
export const mongodb_client = new MongoClient(
  process.env.NEXT_PUBLIC_MONGO_URL_CONNECTION!,
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);
