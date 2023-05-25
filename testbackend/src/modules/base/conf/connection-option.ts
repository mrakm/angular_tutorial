// Connection options for Dev

import { SequelizeOptions } from 'sequelize-typescript';
export const CONN_OPTIONS: SequelizeOptions = {
  username: 'postgres',
  password: 'pass2word',
  database: 'hotel',
  host: '127.0.0.1',
  // host: '18.191.235.120',
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// Connection options for Prod

// import { SequelizeOptions } from "sequelize-typescript";
// export const CONN_OPTIONS: SequelizeOptions = {
//   username: "postgres",
//   password: "pass2word",
//   database: "falettis",
//   host: "postgres.c1vrrtqd7aid.us-east-2.rds.amazonaws.com",
//   dialect: "postgres",
//   dialectOptions: {
//     sslfactory: "org.postgresql.ssl.NonValidatingFactory"
//   },
//   logging: false,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };
