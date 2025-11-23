"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Dishes", [
      // SugarBun Sibu (1)
      {
        restaurant_id: 1,
        name: "Broasted Chicken",
        halal: true,
        description: "Crispy broasted chicken served with rice.",
        price: 13.90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        restaurant_id: 1,
        name: "Fish Burger",
        halal: true,
        description: "Crunchy fish fillet with tartar sauce.",
        price: 9.90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Taman Harmoni (2)
      {
        restaurant_id: 2,
        name: "Kampua Mee",
        halal: false,
        description: "Sibu’s famous dry noodles with pork slices.",
        price: 4.50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        restaurant_id: 2,
        name: "Kom Pia Pork",
        halal: false,
        description: "Traditional Foochow bread with minced pork.",
        price: 3.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Upin Cafe (3)
      {
        restaurant_id: 3,
        name: "Chicken Chop",
        halal: false,
        description: "Grilled chicken chop with black pepper sauce.",
        price: 15.90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        restaurant_id: 3,
        name: "Carbonara Pasta",
        halal: false,
        description: "Creamy pasta with chicken and mushrooms.",
        price: 14.90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Nasi Kandar Pelita (4)
      {
        restaurant_id: 4,
        name: "Nasi Kandar Set",
        halal: true,
        description: "Rice served with curry and fried chicken.",
        price: 12.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        restaurant_id: 4,
        name: "Roti Canai",
        halal: true,
        description: "Fluffy roti served with dhal curry.",
        price: 2.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Warung Selera (5)
      {
        restaurant_id: 5,
        name: "Nasi Goreng Ayam",
        halal: true,
        description: "Fried rice with chicken and spices.",
        price: 8.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        restaurant_id: 5,
        name: "Mee Goreng Mamak",
        halal: true,
        description: "Stir-fried noodles with tofu and egg.",
        price: 7.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Pansar Food Court (6)
      {
        restaurant_id: 6,
        name: "Char Kuey Teow",
        halal: false,
        description: "Wok-fried flat noodles with prawns.",
        price: 7.50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Sushi Tie (7)
      {
        restaurant_id: 7,
        name: "Salmon Sushi",
        halal: false,
        description: "Fresh salmon atop seasoned rice.",
        price: 5.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // KFC (8)
      {
        restaurant_id: 8,
        name: "Zinger Burger",
        halal: true,
        description: "Spicy crispy chicken burger.",
        price: 12.50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // McDonald's (9)
      {
        restaurant_id: 9,
        name: "McChicken",
        halal: true,
        description: "Classic chicken burger with mayo.",
        price: 9.50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Tea Garden (10)
      {
        restaurant_id: 10,
        name: "Iced Milk Tea",
        halal: false,
        description: "Signature tea with milk and ice.",
        price: 5.50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Happy Family Seafood (11)
      {
        restaurant_id: 11,
        name: "Butter Prawn",
        halal: false,
        description: "Creamy buttery prawns.",
        price: 22.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Rasa Sayang Cafe (12)
      {
        restaurant_id: 12,
        name: "Ayam Penyet",
        halal: true,
        description: "Fried chicken smashed with sambal.",
        price: 10.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Dishes", null, {});
  }
};
