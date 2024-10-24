import slugify from "@sindresorhus/slugify";

/**
 * Formats the provided date to a string in 'sv-SE' locale
 * using the 'America/Denver' timezone.
 * @param {Date} str - The date object to format.
 * @returns {string} The formatted date string.
 */
const getURLDate = (str) => {
  const time = str.toLocaleString("sv-SE", {
    timeZone: "America/Denver",
    hour12: false,
  });
  return time;
};

// Export default configuration object
export default function () {
  return {
    tags: "notes",
    layout: "post.njk",
    permalink(data) {
      return `/notes/${slugify(getURLDate(data.date))}/index.html`;
    },
  };
}
