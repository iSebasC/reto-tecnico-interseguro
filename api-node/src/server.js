const app = require('./app');
const { port } = require('./config');

app.listen(port, () => {
  console.log(`api-node corriendo en http://localhost:${port}`);
});
