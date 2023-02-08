// import User from "../db/model/User.js";
// import filterDBResult from "../filterDBResult.js";
import hashPassword from "../hashPassword.js";
// import validate from "../middlewares/validate.js";
// import {
//   validateDisplayName,
//   validateEmail,
//   validateId,
//   validateLimit,
//   validateOffset,
//   validatePassword,
//   validateUsername,
// } from "../validators.js";

const makeMessagesRoutes = ({ app, db }) => {
  app.post(
    "/messages",
    // validate({
    //   body: {
    //     email: validateEmail.required(),
    //     username: validateUsername.required(),
    //     displayName: validateDisplayName.required(),
    //     password: validatePassword.required(),
    //   },
    // }),
    async (req, res) => {
      const { content, userId, nounouId } = req.body;

      try {
        const [message] = await db("messages")
          .insert({
            content,
            userId,
            nounouId,
          })
          .returning("*");
        const [{ count }] = await db("messages").count();

        res.send({ result: message, count }); // filter sensitive data
      } catch (err) {
        if (err.code === "23505") {
          res.status(409).send({
            error: [
              `Duplicated value for "${err.detail.match(/^Key \((\w+)\)/)[1]}"`,
            ],
          });

          return;
        }

        // eslint-disable-next-line no-console
        console.error(err);

        res.status(500).send({ error: ["Oops. Something went wrong."] });
      }
    }
  );
  // READ collection
  app.get(
    "/messages",
    // validate({
    //   query: {
    //     limit: validateLimit,
    //     offset: validateOffset,
    //   },
    // }),
    async (req, res) => {
      // const { limit, offset } = req.query
      const messages = await db("messages");
      // .limit(limit).offset(offset)
      const [{ count }] = await db("messages").count();

      res.send({ result: messages, count });
    }
  );
  // READ single
  app.get(
    "/messages/:nounouId",
    // validate({
    //   params: {
    //     userId: validateId.required(),
    //   },
    // }),
    async (req, res) => {
      const { nounouId } = req.params;

      // if (typeof userId == "number") {
      const messages = await db("messages").where({ nounouId: nounouId });
      const [{ count }] = await db("messages").count();

      if (!messages) {
        res.status(404).send({ error: ["User not found."] });

        return;
      }

      res.send({ result: messages, count });
    }
  );

  // UPDATE partial
  app.patch(
    "/users/:userId",
    // validate({
    //   params: {
    //     userId: validateId.required(),
    //   },
    //   body: {
    //     email: validateEmail,
    //     username: validateUsername,
    //     displayName: validateDisplayName,
    //     password: validatePassword,
    //   },
    // }),
    async (req, res) => {
      const {
        params: { userId },
        body: { email1, username1, displayName1, password1 },
      } = req;

      const object = [email1, username1, displayName1, password1].map(
        (item) => {
          if (item === "") {
            return undefined;
          }

          return item;
        }
      );
      const email = object[0];
      const username = object[1];
      const displayName = object[2];
      const password = object[3];

      const [user] = await db("users").where({ id: userId });

      if (!user) {
        res.status(404).send({ error: ["User not found."] });

        return;
      }

      let passwordHash;
      let passwordSalt;

      if (password) {
        const [hash, salt] = hashPassword(password);

        passwordHash = hash;
        passwordSalt = salt;
      }

      try {
        const [updatedUser] = await await db("users")
          .where({ id: userId })
          // User.query().findById(userId)
          .update({
            email,
            username,
            displayName,
            passwordHash,
            passwordSalt,
            updatedAt: new Date(),
          })
          .returning("*");

        res.send({ result: [updatedUser] });
      } catch (err) {
        if (err.code === "23505") {
          res.status(409).send({
            error: [
              `Duplicated value for "${err.detail.match(/^Key \((\w+)\)/)[1]}"`,
            ],
          });

          return;
        }

        // eslint-disable-next-line no-console
        console.error(err);

        res.status(500).send({ error: "Oops. Something went wrong." });
      }
    }
  );

  // UPDATE password
  app.patch(
    "/users/password/:userId",
    // validate({
    //   params: {
    //     userId: validateId.required(),
    //   },
    // ,
    // body: {
    //   email: validateEmail,
    //   username: validateUsername,
    //   displayName: validateDisplayName,
    //   password: validatePassword,
    // },
    // }),
    async (req, res) => {
      const {
        params: { userId },
        body: { password },
      } = req;

      const [user] = await db("users").where({ email: userId });
      // User.query().findById(userId)

      if (!user) {
        res.status(404).send({ error: ["User not found."] });

        return;
      }

      let passwordHash;
      let passwordSalt;

      if (password) {
        const [hash, salt] = hashPassword(password);

        passwordHash = hash;
        passwordSalt = salt;
      }

      try {
        const [updatedUser] = await await db("users")
          .where({ email: userId })
          // User.query().findById(userId)
          .update({
            passwordHash,
            passwordSalt,
            updatedAt: new Date(),
          })
          .returning("*");

        res.send({ result: [updatedUser] });
      } catch (err) {
        if (err.code === "23505") {
          res.status(409).send({
            error: [
              `Duplicated value for "${err.detail.match(/^Key \((\w+)\)/)[1]}"`,
            ],
          });

          return;
        }

        // eslint-disable-next-line no-console
        console.error(err);

        res.status(500).send({ error: "Oops. Something went wrong." });
      }
    }
  );

  // DELETE
  app.delete(
    "/users/:userId",
    // validate({
    //   params: {
    //     userId: validateId.required(),
    //   },
    // }),
    async (req, res) => {
      const { userId } = req.params;
      const [user] = await db("users").where({ id: userId });

      if (!user) {
        res.status(404).send({ error: ["User not found."] });

        return;
      }

      await db("users").delete().where({ id: userId });

      res.send({ result: [user], count: 1 });
    }
  );
};

export default makeMessagesRoutes;
