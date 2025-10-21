const express = require('express');
const router = express.Router();

// Mock data - in a real app, this would come from a database
const locations = {
  country: "Bosnia and Herzegovina",
  cities: [
    {
      name: "Sarajevo",
      categories: {
        shoppingCenters: ["SCC", "Alta", "Aria"],
        restaurants: ["Željo", "Park Prinčeva", "Metropolis"],
        famousPlaces: ["Baščaršija", "Vijećnica", "Avaz Tower"]
      }
    },
    {
      name: "Mostar",
      categories: {
        shoppingCenters: ["Rondo", "Cactus"],
        restaurants: ["Tima", "Šadrvan", "Kujundžiluk"],
        famousPlaces: ["Stari Most", "Koski Mehmed Paša Mosque", "Crooked Bridge"]
      }
    }
  ]
};

// @route   GET /api/locations
// @desc    Get all locations
router.get('/', (req, res) => {
  res.json(locations);
});

module.exports = router;