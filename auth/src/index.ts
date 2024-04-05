import express from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { signinRouter } from "./routes/signin";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import cookieSession from "cookie-session";
import mongoose from "mongoose";

const app = express();
app.set('trust proxy',true)
app.use(express.json());
app.use(cookieSession({signed: false, secure:true}))
app.use(express.urlencoded({ extended: true }));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {

  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY must be defined')
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log('Connected To MongoDb');
  } catch (err) {
    console.log(err);
  }
  const port = 3000;
  app.listen(port, () => {
    console.log(`App started on port ${port}`);
  });
};

start()