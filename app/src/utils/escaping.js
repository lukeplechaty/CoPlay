// using the ascii val (%2E) causes issues with clerk so custom value instead
export const encodePeriod = (string) => string.replaceAll(".", "&per;");
export const decodePeriod = (string) =>
  decodeURIComponent(string).replaceAll("&per;", ".");
