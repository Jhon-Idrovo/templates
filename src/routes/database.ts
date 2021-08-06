import mongoose from "mongoose";

mongoose
  .connect(process.env.DB_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((db) => {
    console.log("Connection with database stablished");
  })
  .catch((err) => console.log("Unable to connecto to database", err));
