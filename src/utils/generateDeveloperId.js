export function generateDeveloperId(userId) {
  if (typeof userId !== "string" || userId.length !== 28) {
    throw new Error("Invalid userId — must be 28 characters long");
  }

  const arr = userId.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  const trimmed = arr.join("").slice(0, 20);

  return `dev_${trimmed}`;
}
