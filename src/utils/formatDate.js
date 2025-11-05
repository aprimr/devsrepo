export function formatDate(timestamp) {
  if (!timestamp) return "Unknown date";

  let date;

  // Firestore Timestamp object
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  }
  // Plain JS Date object
  else if (timestamp instanceof Date) {
    date = timestamp;
  }
  // Maybe a string or number
  else {
    date = new Date(timestamp);
  }

  // Check if valid date
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kathmandu",
  });
}
