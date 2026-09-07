const http = require('http');
const app = require('./app');
const { seedDefaultUser } = require('./utils/seedDefaultUser');
// require('dotenv').config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

const httpServer = http.createServer(app);

httpServer.listen(PORT, HOST, async () => {
  console.log(`Server is listening http://${HOST}:${PORT}`);
  try {
    await seedDefaultUser();
  } catch (err) {
    console.error('Default user seed failed:', err.message);
  }
});
