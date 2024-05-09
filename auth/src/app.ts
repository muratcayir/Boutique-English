import express from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { signinRouter } from "./routes/signin";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import cookieSession from "cookie-session";

const app = express();

// Trust first proxy
app.set('trust proxy', 1);

// Parse URL-encoded bodies before cookie-parser middleware
app.use(express.urlencoded({ extended: true }));

// Use cookie-session middleware
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV === 'production' }));

// Use JSON parser middleware
app.use(express.json());

// Use routers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Handle 404 errors
app.all("*", () => {
  throw new NotFoundError();
});

// Error handling middleware
app.use(errorHandler);

export { app };
