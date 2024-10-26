import express from 'express';
import { env } from 'process';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { serve, setup } from 'swagger-ui-express';
import { openConnection } from './config/mongoose.config';
import { swaggerConfig } from './swagger.config';
import { swaggerConfig2 } from './swagger.config.example';

const main = async () => {
    const app = express();
    config();
    app.use(cors());
    app.use(morgan('tiny'));
    app.use(helmet());
    const port = env.PORT || 4000;
    app.use('/api-docs', serve, setup(swaggerConfig));
    app.use('/api-docs-example', serve, setup(swaggerConfig2));
    // app.use('/api/v1/');
    await openConnection();
    app.listen(port, () => {
        console.log(`Run app in port: ${port}`);
    });
}
main();