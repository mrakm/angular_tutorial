'use strict';

const sequelize = require('sequelize');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').then(() => {
      return queryInterface.createTable('Product', {
        id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },

   

        name: {
          type: Sequelize.STRING,
        },

        price: {
          type: Sequelize.FLOAT,
        },

        description: {
          type: Sequelize.STRING,
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        createdBy: {
          type: Sequelize.UUID,
        },
        updatedBy: {
          type: Sequelize.UUID,
        },
        deletedAt: {
          type: Sequelize.DATE,
          defaultValue: new Date(0),
        },
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Product');
  },
};
