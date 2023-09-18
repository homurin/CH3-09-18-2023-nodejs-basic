const fs = require("fs");
const http = require("http");
const url = require("url");

// const buffer = fs.readFileSync("./txt/read-this.txt", "utf-8");
// console.info(buffer);

// const textOut = `Sukses mencetak tentang alpukat dalam bahasa inggris : ${buffer}`;
// fs.writeFileSync("txt/output-penjelasan.txt", textOut);
// console.info("Success print letter");

// non blocking

// const test = fs.readFile("./txt/start.txt", (err, parentData) => {
//   if (err) {
//     throw Error("Something went wrong");
//   }
//   console.info(parentData.toString("utf-8"));
//   fs.readFile(`./txt/${parentData}.txt`, "utf-8", (err, childData) => {
//     if (err) {
//       throw Error("Something went wrong");
//     }
//     console.info(childData);
//     fs.writeFile(`./txt/merger.txt`, `${parentData}\n${childData}`, (err) => {
//       if (err) {
//         throw Error("Something went wrong");
//       }
//       console.info(`Sukses`);
//       const readThis = fs.readFileSync("./txt/read-this.txt", "utf-8");
//       const finalTxt = fs.readFileSync("./txt/final.txt", "utf-8");

//       fs.writeFile("./txt/challenge.txt", `${readThis}\n${finalTxt}`, (err) => {
//         if (err) {
//           throw new Error("Something went wrong");
//         }
//         console.info(`success merging read-this and final`);
//       });
//     });
//   });
// });
// console.info(test);
// console.info("Hi F2W nunggu read file yah");
function replaceTemplate(template, product) {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
}
const buffer = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(buffer);
const overviewPage = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const productTemplate = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const productCardTemplate = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const server = http.createServer((req, res) => {
  const { query, pathname: pathName } = url.parse(req.url, true);

  // hello page
  if (pathName === "/hello") {
    res.end("Hello FS2 ／人◕ ‿‿ ◕人＼");
    //product page

    // overview page
  } else if (pathName === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const productCardHtml = dataObj.map((e) => {
      return replaceTemplate(productCardTemplate, e);
    });
    const output = overviewPage.replace("{%PRODUCT_CARDS%}", productCardHtml);
    res.end(output);
    //overview api
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(buffer);
    //product page
  } else if (pathName === "/product") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(productTemplate, product);
    res.end(output);
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end(`<h1>Gak ada apa-apa</h1>`);
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.info(`server listening at http://localhost:3000 ／人◕ ‿‿ ◕人＼`);
});
