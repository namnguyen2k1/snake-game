import { Strategy } from "passport-local";
import * as userService from "../services/user.service.js";

export function configurationPassport(passport) {
  passport.use(
    new Strategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isMatch = await userService.validatePassword(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) =>
    userService
      .findUserById(id)
      .then((user) => done(null, user))
      .catch(done),
  );
}
