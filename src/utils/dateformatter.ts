type DateFormat =
  | "MMM DD YYYY"
  | "MMM DD"
  | "YYYY MMM DD"
  | "DD MMM YYYY"
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
  
    const date = new Date(dateValue);
  
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
  
  
