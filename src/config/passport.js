import { Strategy } from 'passport-local';
import * as userService from '../services/user.service.js';

export default function (passport) {
  passport.use(
    new Strategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await userService.findUserByEmail(email);
        console.log('user found', user);
        if (!user) {
          console.log('not found user', user);
          return done(null, false, { message: 'User not found' });
        }

        console.log('is match password', false);

        const isMatch = await userService.validatePassword(password, user.password);
        console.log('is match password', isMatch);

        if (!isMatch) return done(null, false, { message: 'Invalid password' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) =>
    userService
      .findUserById(id)
      .then(user => done(null, user))
      .catch(done)
  );
}
