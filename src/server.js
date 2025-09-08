import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/app.config.js';
import { connectDatabase } from './config/database.js';
import { configurationPassport } from './config/passport.js';
import { matchRoutes } from './routes/match.routes.js';
import { playgroundRoutes } from './routes/playground.routes.js';
import { userRoutes } from './routes/user.routes.js';

async function bootstrap() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const app = express();

  // view engine
  app.set('views', join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // middleware
  app.use(express.static(join(__dirname, 'public')));
  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'keyboard cat',
      resave: false,
      saveUninitialized: false
    })
  );

  // passport configuration
  configurationPassport(passport);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });

  // database
  await connectDatabase();

  // routes
  app.use('/', playgroundRoutes());
  app.use('/users', userRoutes());
  app.use('/api/match', matchRoutes());

  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
  });
}

bootstrap();
