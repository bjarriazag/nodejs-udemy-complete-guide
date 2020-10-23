const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const start = async () => {
  const port = 3000;

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(rootDir, '..', 'public')));

  app.use('/admin', adminRoutes);
  app.use(shopRoutes);

  app.use('/', errorController.get404);

  // Sequelize
  sequelize
    .sync()
    .then((result) => {
      console.log(result);
      app.listen(port, () => {
        console.log(`Listening on port ${port}!!!!!!!!`);
      });
    })
    .catch(console.error);
};

start();
