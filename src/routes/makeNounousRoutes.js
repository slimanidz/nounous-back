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

const makeUsersRoutes = ({ app, db }) => {
  app.post(
    "/nounous",
    // validate({
    //   body: {
    //     email: validateEmail.required(),
    //     username: validateUsername.required(),
    //     displayName: validateDisplayName.required(),
    //     password: validatePassword.required(),
    //   },
    // }),
    async (req, res) => {
      const {
        email,
        username,
        telephone,
        localite,
        situation,
        // image,
        password,
      } = req.body;
      const [passwordHash, passwordSalt] = hashPassword(password);

      try {
        const [nounou] = await db("nounous")
          .insert({
            email,
            username,
            telephone,
            localite,
            situation,
            // image,
            passwordHash,
            passwordSalt,
          })
          .returning("*");
        const [{ count }] = await db("nounous").count();

        res.send({ result: nounou, count }); // filter sensitive data
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
    "/nounous",
    // validate({
    //   query: {
    //     limit: validateLimit,
    //     offset: validateOffset,
    //   },
    // }),
    async (req, res) => {
      // const { limit, offset } = req.query
      const nounous = await db("nounous");
      // .limit(limit).offset(offset)
      const [{ count }] = await db("nounous").count();

      res.send({ result: nounous, count });
    }
  );
  // READ single
  app.get(
    "/nounous/:nounouId",
    // validate({
    //   params: {
    //     userId: validateId.required(),
    //   },
    // }),
    async (req, res) => {
      const { nounouId } = req.params;

      // if (typeof userId == "number") {
      const [nounou] = await db("nounous").where({ id: nounouId });
      const [{ count }] = await db("nounous").count();

      if (!nounou) {
        res.status(404).send({ error: ["User not found."] });

        return;
      }

      res.send({ result: nounou, count });
    }
  );

  app.get(
    "/nounous/adresse/:adresse",
    // validate({
    //   params: {
    //     userId: validateId.required(),
    //   },
    // }),
    async (req, res) => {
      const { adresse } = req.params;
      console.log({ adr: adresse });

      // if (typeof userId == "number") {
      const nounous = await db("nounous").where({ localite: adresse });
      const [{ count }] = await db("nounous").count();

      if (!nounous) {
        res.status(404).send({ error: ["User not found."] });

        return;
      }

      res.send({ result: nounous, count });
    }
  );

  // UPDATE partial
  app.patch(
    "/nounous/:nounouId",
    // validate({
    //   params: {
    //     nounouId: validateId.required(),
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
        params: { nounouId },
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

      const [nounou] = await db("nounous").where({ id: nounouId });

      if (!nounou) {
        res.status(404).send({ error: ["nounou not found."] });

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
        const [updatedUser] = await await db("nounous")
          .where({ id: nounouId })
          // User.query().findById(nounouId)
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
    "/nounous/password/:nounouId",
    // validate({
    //   params: {
    //     nounouId: validateId.required(),
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
        params: { nounouId },
        body: { password },
      } = req;

      const [nounou] = await db("nounous").where({ email: nounouId });
      // User.query().findById(userId)

      if (!nounou) {
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
        const [updatedUser] = await db("nounous")
          .where({ email: nounouId })
          // User.query().findById(nounouId)
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
    "/nounous/:nounouId",
    // validate({
    //   params: {
    //     nounouId: validateId.required(),
    //   },
    // }),
    async (req, res) => {
      const { nounouId } = req.params;
      const [nounou] = await db("nounous").where({ id: nounouId });

      if (!nounou) {
        res.status(404).send({ error: ["nounou not found."] });

        return;
      }

      await db("nounous").delete().where({ id: nounouId });

      res.send({ result: [nounou], count: 1 });
    }
  );
};

export default makeUsersRoutes;
