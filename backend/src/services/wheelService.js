const { Dish, Restaurant } = require("../models");

const wheelService = {
  spin: async () => {
    const dishes = await Dish.findAll({
      include: { model: Restaurant }
    });

    if (dishes.length === 0) return null;

    // pick random meal
    const randomIndex = Math.floor(Math.random() * dishes.length);

    return dishes[randomIndex];
  }
};

module.exports = wheelService;
