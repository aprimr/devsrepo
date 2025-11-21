export const calculateRating = (data) => {
  const noOfRatings =
    (data[1] || 0) +
    (data[2] || 0) +
    (data[3] || 0) +
    (data[4] || 0) +
    (data[5] || 0);

  if (noOfRatings === 0) return 0;

  const sum =
    (data[1] || 0) * 1 +
    (data[2] || 0) * 2 +
    (data[3] || 0) * 3 +
    (data[4] || 0) * 4 +
    (data[5] || 0) * 5;

  const rating = sum / noOfRatings;

  return Number(rating.toFixed(1));
};
