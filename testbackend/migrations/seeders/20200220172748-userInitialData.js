"use strict";
const bcrypt = require("bcrypt");
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          userName: "admin@site.com",
          password: bcrypt.hashSync("doers", 10),
          isSuperUser: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userName: "admin@zaryab.com",
          password: bcrypt.hashSync("doers", 10),
          isSuperUser: false,
          application: 'Admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("Users", null, {})
  }
};
