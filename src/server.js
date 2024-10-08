const app = require('./app');
const env = require('./utils/setEnv');

const port = env.PORT;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
