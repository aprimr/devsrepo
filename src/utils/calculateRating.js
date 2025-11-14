export const calculateRating = (data) => {
  let noOfRatings = data[1] + data[2] + data[3] + data[4] + data[5];
  const sum =
    data[1] * 1 + data[2] * 2 + data[3] * 3 + data[4] * 4 + data[5] * 5;
  let rating = (sum / noOfRatings).toFixed(1);
  return rating;
};
