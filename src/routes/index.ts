/**
 * server initialization
 */
import dotenv from "dotenv";
import initializeRoles from "../utils/initializeRoles";
//load enviroment variables. This must be before the database import
dotenv.config();

import app from "./app";
import "./database";
initializeRoles();
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`API available on port ${port}`));
