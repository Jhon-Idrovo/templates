const CATEGORIES = {
  General: 9,
  Computers: 18,
  Books: 10,
  Films: 11,
  Music: 12,
  "Musicals&Theatres": 13,
  Television: 14,
  "Video Games": 15,
  "Board Games": 16,
  "Science&Nature": 17,
  Mathematics: 19,
  Mythology: 20,
  Sports: 21,
  Geography: 22,
  History: 22,
  Politics: 23,
  Art: 24,
  Celebrities: 25,
  Animals: 26,
  Vehicles: 27,
  Comics: 28,
  "Science Gadgets": 29,
  Anime: 30,
  Cartoons: 31,
};

export const getAllCategoryNames = () => {
  const categories = Object.keys(CATEGORIES);
  return categories;
};
export const getCategoryCode = (name) => {
  return CATEGORIES[name];
};

export const calcPoints = (answers) => {
  return answers.filter((a) => a === "correct").length * 100;
};
