const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const categoryRoutes = require('./routes/categories');

const app = express();
const port = Number(process.env.PORT || 3002);

app.use(cors());
app.use(express.json());
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(port, function () {
  console.log('Pine & River API listening on http://localhost:' + port);
});
