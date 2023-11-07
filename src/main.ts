import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: (origin, cb) => {
      cb(null, true)
      return;
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers)
  };

  // Enable CORS using the defined options
  app.enableCors(corsOptions);

  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
