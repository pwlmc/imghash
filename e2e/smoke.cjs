const imghash = require("../dist/index.js");

imghash.hash(__dirname + "/../assets/absolut2").then((hash) => {
  console.log(hash); // e781c3c3c3c3819f
});
