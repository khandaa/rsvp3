require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database/rsvp_event_app_dev.sqlite',
    logging: console.log,
  },
  test: {
    dialect: 'sqlite',
    storage: process.env.TEST_DB_STORAGE || './database/rsvp_event_app_test.sqlite',
    logging: false,
  },
  production: {
    dialect: 'sqlite',
    storage: process.env.PROD_DB_STORAGE || './database/rsvp_event_app_prod.sqlite',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
