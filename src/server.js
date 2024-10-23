const app = require('./app');
const env = require('./config/index');

require('./config/database');

const port = env.PORT;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
