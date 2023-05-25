'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').then(() => {
      return queryInterface.createTable('Menus', {
        id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        parentId: {
          type: Sequelize.DataTypes.UUID,
        },
        imgSrc: {
          type: Sequelize.STRING,
        },
        url: {
          type: Sequelize.STRING,
        },
        name: {
          type: Sequelize.STRING,
        },
        application: {
          type: Sequelize.STRING,
        },
        isConfiguration: {
          type: Sequelize.BOOLEAN,
        },
        menuNumber: {
          type: Sequelize.INTEGER,
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
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
    return queryInterface.dropTable('Menus');
  },
};
