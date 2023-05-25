'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'Menus',
      [
        {
          imgSrc: '../../../assets/images/icons/sidenav/home.png',
          url: 'a/d/product',
          name: 'Product',
          isConfiguration: false,
          menuNumber: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
   
      ],
      {}
    );

   
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Menus', null, {});
  },
};
