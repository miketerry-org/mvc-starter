// index.js: Implements express view engine for javascript template literals

"use strict";

// load all necessary packages
const path = require("path");
const fs = require("fs");
const { minify } = require("html-minifier-terser");
const compression = require("compression"); // Gzip compression middleware

// Global cache to store precompiled templates
const templateCache = {};

// template literal engine
function templateLiteralEngine(filePath, options, callback, req) {
  // Check if the template is already cached
  if (templateCache[filePath]) {
    // If cached, use the precompiled function from the cache
    try {
      const templateFunction = templateCache[filePath];
      const mergedData = { ...req.res.locals, ...options };
      let renderedHTML = templateFunction(mergedData);

      // Minify the HTML before sending the response
      renderedHTML = minify(renderedHTML, {
        collapseWhitespace: true, // Collapse all white spaces
        removeComments: true, // Remove comments
        removeRedundantAttributes: true, // Remove redundant attributes
        removeEmptyAttributes: true, // Remove empty attributes
        minifyJS: true, // Minify inline JavaScript
        minifyCSS: true, // Minify inline CSS
      });

      callback(null, renderedHTML);
    } catch (err) {
      callback(err);
    }
  } else {
    // If not cached, load and compile the template from disk
    const templatePath = path.resolve("templates", `${filePath}.tpl.js`);

    // Read the template file
    fs.readFile(templatePath, "utf8", (err, content) => {
      if (err) return callback(err);

      // Strip out the /*html*/ comment from the start
      const cleanedContent = content.replace(/\/\*html\*\//, "").trim();

      try {
        // Create a new function using the cleaned content
        const templateFunction = new Function(
          "data",
          `return \`${cleanedContent}\`;`
        );

        // Cache the compiled function
        templateCache[filePath] = templateFunction;

        // Merge the data with res.locals
        const mergedData = { ...req.res.locals, ...options };

        // Render the HTML
        let renderedHTML = templateFunction(mergedData);

        // Minify the HTML before sending the response
        renderedHTML = minify(renderedHTML, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          minifyJS: true,
          minifyCSS: true,
        });

        callback(null, renderedHTML);
      } catch (err) {
        callback(err);
      }
    });
  }
}

// export the template literal express view engine
module.exports = templateLiteralEngine;
