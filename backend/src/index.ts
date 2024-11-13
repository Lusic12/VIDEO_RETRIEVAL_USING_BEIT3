import { json } from 'body-parser';
import { configDotenv } from 'dotenv';
import * as express from 'express';

configDotenv();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .on('error', (error) => {
    console.error(error);
  });
