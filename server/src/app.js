import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import visitorRoutes from "./routes/visitor.routes.js";

import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(helmet());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/visitors", visitorRoutes);

app.use(errorHandler);

export default app;