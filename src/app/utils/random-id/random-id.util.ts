export const generateRandomId = (min: number = 0, max: number = 99999999) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
