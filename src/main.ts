import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotFoundException, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const SESSION_SECRET = process.env.SESSION_SECRET;

  if (!SESSION_SECRET)
    throw new NotFoundException('Cannot extract session secret');

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(3333);
}
bootstrap();
