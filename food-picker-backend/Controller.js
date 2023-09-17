// this will be the storage without a database, since requirements don't need a database
const foodPlaces = [];

// class not necessary
// const FoodPlace = class {
//   constructor(name) {
//     this.name = name;
//   }

//   getName = () => {
//     return this.name;
//   };
// };

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const addFoodPlace = (name) => {
  if (name && /[^0-9A-Za-z\-@!&]/.test(name)) {
    throw new Error("Invalid characters detected");
  } else if (name && !foodPlaces.includes(name)) {
    foodPlaces.push(name);
    return name;
  } else if (name && foodPlaces.includes(name)) {
    throw new Error("Food place already exists!");
  } else {
    throw new Error("Invalid parameters, no name provided");
  }
};

const getAllFoodPlaces = () => {
  if (foodPlaces.length > 0) {
    return foodPlaces;
  } else {
    throw new Error("No food places available!");
  }
};

const getRandomFoodPlace = () => {
  if (foodPlaces.length > 0) {
    const randomizedFoodPlace =
      foodPlaces[getRandomInt(0, foodPlaces.length - 1)];
    return randomizedFoodPlace;
  } else {
    throw new Error("No food places available!");
  }
};

module.exports = { addFoodPlace, getAllFoodPlaces, getRandomFoodPlace };
