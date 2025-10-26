const generateUsername = (name) => {
  const base = name?.toLowerCase().replace(/\s+/g, "_") || "user";
  const random = Math.floor(Math.random() * 1000);
  return `${base}_${random}`;
};

export default generateUsername;
