export default function formatTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000); // Difference in minutes

  if (diffInMinutes < 60) {
    // Less than an hour, display in minutes
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  } else if (diffInMinutes < 1440) {
    // Less than a day, display in hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else {
    // More than or equal to a day, display in days
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
}

// Example Usage
console.log(formatTime(new Date(Date.now() - 45 * 60000))); // Output: "45 minutes ago"
console.log(formatTime(new Date(Date.now() - 120 * 60000))); // Output: "2 hours ago"
console.log(formatTime(new Date(Date.now() - 1500 * 60000))); // Output: "1 day ago"
