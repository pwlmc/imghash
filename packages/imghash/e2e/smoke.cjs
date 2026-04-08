const imghash = require("../dist/index.cjs");

imghash.hash(__dirname + "/../../../assets/absolut2").then((hash) => {
  console.log(hash); // e781c3c3c3c3819f
});
