import { EleventyRenderPlugin, EleventyHtmlBasePlugin } from "@11ty/eleventy";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { DateTime } from "luxon";

// Filters
function registerFilters(eleventyConfig) {
  eleventyConfig.addFilter("webmentionsByUrl", (webmentions, url) =>
    webmentions.filter((mention) => mention["wm-target"] === url)
  );

  eleventyConfig.addFilter("getLikes", (webmentions) =>
    webmentions.filter((mention) => mention["wm-property"] === "like-of")
  );

  eleventyConfig.addFilter("getReplies", (webmentions) =>
    webmentions.filter((mention) => mention["wm-property"] === "in-reply-to")
  );

  eleventyConfig.addFilter("formatPostDate", (date) =>
    DateTime.fromISO(date).toFormat("MMM d, yyyy")
  );
}

// Collections
function registerCollections(eleventyConfig) {
  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByGlob("content/notes/*.md").reverse()
  );

  eleventyConfig.addCollection("latestPosts", (collectionApi) =>
    collectionApi.getFilteredByGlob("content/notes/*.md").reverse().slice(0, 5)
  );
}

// Plugins
function registerPlugins(eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
}

// Main Configuration
export default function (eleventyConfig) {
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  // Register Filters, Collections, and Plugins
  registerFilters(eleventyConfig);
  registerCollections(eleventyConfig);
  registerPlugins(eleventyConfig);

  // Watch Targets and Passthrough Copy
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");
  eleventyConfig.addWatchTarget("tailwind.config.js");
  eleventyConfig.addPassthroughCopy({ "./public/": "/" });

  // Error Handling
  eleventyConfig.on("eleventy.error", (error) => {
    console.error("Eleventy encountered an error:", error.message);
  });

  // Configuration Return
  return {
    dir: {
      input: "content",
      includes: "../_includes",
      layouts: "../_includes/layouts",
      output: "_site",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
