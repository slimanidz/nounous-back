import cors from "cors";
import express from "express";
import knex from "knex";
// import { Model } from "objection";
import config from "./config.js";
import makeCommentsRoutes from "./routes/makeCommentRoutes.js";
import makeMessagesRoutes from "./routes/makeMessagesRoutes.js";
import makeNounousRoutes from "./routes/makeNounousRoutes.js";
import makeServiceRoutes from "./routes/makeServicesRoutes.js";
import makeSessionNounousRoutes from "./routes/makeSessionNounousRoutes.js";
import makeSessionRoutes from "./routes/makeSessionRoutes.js";
import makeUploadRoutes from "./routes/makeUploadRoutes.js";
import makeUsersRoutes from "./routes/makeUsersRoutes.js";

const app = express();
const db = knex(config.db);

// Model.knex(db);

app.use(cors());
app.use(express.json());

makeUsersRoutes({ app, db });
makeNounousRoutes({ app, db });
makeSessionRoutes({ app, db });
makeSessionNounousRoutes({ app, db });
makeServiceRoutes({ app, db });
makeCommentsRoutes({ app, db });
makeMessagesRoutes({ app, db });

makeUploadRoutes({ app, db });

app.listen(config.server.port, () =>
  // eslint-disable-next-line no-console
  console.log(`Listening on :${config.server.port}`)
);
