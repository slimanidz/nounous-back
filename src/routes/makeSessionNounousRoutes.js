import jsonwebtoken from "jsonwebtoken";
import config from "../config.js";
import hashPassword from "../hashPassword.js";
// import validate from "../middlewares/validate.js";
// import { validateEmailOrUsername, validatePassword } from "../validators.js";

const makeSessionNounousRoutes = ({ app, db }) => {
  app.post(
    "/sign-in-nounous",
    // validate({
    //   emailOrUsername: validateEmailOrUsername.required(),
    //   password: validatePassword.required(),
    // }),
    async (req, res) => {
      const { emailOrUsername, password } = req.body;

      if (!emailOrUsername) {
        res.status(401).send({ error: ["Invalid credentials."] });

        return;
      }

      const [nounou] = await db("nounous")
        .where({
          email: emailOrUsername,
        })
        .orWhere({
          username: emailOrUsername,
        });

      if (!nounou) {
        res.status(401).send({ error: ["Invalid credentials."] });

        return;
      }

      const [passwordHash] = hashPassword(password, nounou.passwordSalt);

      if (passwordHash !== nounou.passwordHash) {
        res.status(401).send({ error: ["Invalid credentials."] });

        return;
      }

      const jwt1 = jsonwebtoken.sign(
        {
          session1: {
            nounou: {
              id: nounou.id,
              username: nounou.username,
              email: nounou.email,
              telephone: nounou.telephone,
            },
          },
        },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn }
      );

      res.send({ result: [{ jwt1 }], count: 1 });
    }
  );
};

export default makeSessionNounousRoutes;
