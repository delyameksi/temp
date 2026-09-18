import express from 'express';
import 'dotenv/config';
import { serverAdapter } from './bull-board';
import db from './persistence';
import authRouter from './modules/auth/auth.route';
import userRouter from './modules/user/user.route';
import taskRouter from './modules/tasks/tasks.route';
import swaggerUi from 'swagger-ui-express';
import projectRouter from './modules/project/project.route';
import { swaggerSpec } from './swagger';

const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/static'));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Body :', req.body);
  next();
});
app.use('/admin/queues', serverAdapter.getRouter());
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/tasks', taskRouter);
app.use('/projects', projectRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

db.init()
  .then(() => {
    app.listen(3000, () => {
      console.log('API: http://localhost:3000');
      console.log('Swagger: http://localhost:3000/api-docs');
    });
  })
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });

const gracefulShutdown = (): void => {
  db.teardown()
    .catch((err: Error) => {
      console.error('Error during database teardown:', err);
    })
    .finally(() => {
      process.exit(0);
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
