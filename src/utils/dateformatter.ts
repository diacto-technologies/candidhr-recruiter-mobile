type DateFormat =
  | "MMM DD YYYY"
  | "MMM DD"
  | "YYYY MMM DD"
  | "DD MMM YYYY"
  | "DD MMM"
  | "DD MMM YYYY HH:mm"
  | "MMM YYYY";

type TimeZoneType = "UTC" | "IST";


export const formatMonDDYYYY = (
  dateValue: string | number | null | undefined,
  format?: DateFormat,
  timezone: TimeZoneType = "UTC"
): string => {
  if (!dateValue) return "";

  if (
    typeof dateValue === "string" &&
    dateValue.toLowerCase() === "present"
  ) {
    return "Present";
  }

  let date: Date;

  // ✅ Added support for DD/MM/YYYY format (ONLY THIS PART ADDED)
  if (typeof dateValue === "string" && dateValue.includes("/")) {
    const parts = dateValue.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      date = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
      date = new Date(dateValue);
    }
  } else {
    date = new Date(dateValue);
  }

  if (isNaN(date.getTime())) return "";

  // ✅ Convert to IST if required
  const adjustedDate =
    timezone === "IST"
      ? new Date(date.getTime() + 5.5 * 60 * 60 * 1000)
      : date;

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const month = months[adjustedDate.getUTCMonth()];
  const day = String(adjustedDate.getUTCDate()).padStart(2, "0");
  const year = String(adjustedDate.getUTCFullYear());

  const rawHours = adjustedDate.getUTCHours();
  const hours12 = String(rawHours % 12 || 12).padStart(2, "0");
  const minutes = String(adjustedDate.getUTCMinutes()).padStart(2, "0");
  const meridiem = rawHours >= 12 ? "PM" : "AM";

  if (!format) {
    return `${month} ${day} ${year}`;
  }

  if (format === "DD MMM YYYY HH:mm") {
    return `${day} ${month} ${year} ${hours12}:${minutes} ${meridiem}`;
  }

  const tokens: Record<string, string> = {
    MMM: month,
    DD: day,
    YYYY: year,
  };

  return format.replace(/MMM|DD|YYYY/g, token => tokens[token]);
};

export const formatTime = (seconds?: number) => {
  const s = Number(seconds ?? 0);
  if (!Number.isFinite(s) || s <= 0) return "0s";
  const mins = Math.floor(s / 60);
  const rem = Math.floor(s % 60);
  if (mins <= 0) return `${rem}s`;
  return `${mins}m ${rem}s`;
};

export const formatTimeAgo = (dateValue: string | number | null | undefined): string => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
};
