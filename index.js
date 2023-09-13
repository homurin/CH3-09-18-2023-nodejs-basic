const fs = require("fs");
const http = require("http");
const url = require("url");

// const buffer = fs.readFileSync("./txt/read-this.txt", "utf-8");
// console.info(buffer);

// const textOut = `Sukses mencetak tentang alpukat dalam bahasa inggris : ${buffer}`;
// fs.writeFileSync("txt/output-penjelasan.txt", textOut);
// console.info("Success print letter");

// non blocking

const test = fs.readFile("./txt/start.txt", (err, parentData) => {
  if (err) {
    throw Error("Something went wrong");
  }
  console.info(parentData.toString("utf-8"));
  fs.readFile(`./txt/${parentData}.txt`, "utf-8", (err, childData) => {
    if (err) {
      throw Error("Something went wrong");
    }
    console.info(childData);
    fs.writeFile(`./txt/merger.txt`, `${parentData}\n${childData}`, (err) => {
      if (err) {
        throw Error("Something went wrong");
      }
      console.info(`Sukses`);
      const readThis = fs.readFileSync("./txt/read-this.txt", "utf-8");
      const finalTxt = fs.readFileSync("./txt/final.txt", "utf-8");

      fs.writeFile("./txt/challenge.txt", `${readThis}\n${finalTxt}`, (err) => {
        if (err) {
          throw new Error("Something went wrong");
        }
        console.info(`success merging read-this and final`);
      });
    });
  });
});
console.info(test);
console.info("Hi F2W nunggu read file yah");

const server = http.createServer((req, res) => {
  const pathName = req.url;
  console.info(req.url);
  if (pathName === "/hello") {
    res.end("Hello FS2 ／人◕ ‿‿ ◕人＼");
  } else if (pathName === "/product") {
    res.end(
      JSON.stringify({
        data: "Ini produk ／人◕ ‿‿ ◕人＼",
      })
    );
  } else if (pathName === "/overview") {
    const overviewPage = fs.readFileSync(
      `${__dirname}/templates/overview.html`
    );
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.end(overviewPage);
  } else if (pathName === "/api") {
    const buffer = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(buffer);
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end(`<h1>Gak ada apa-apa ／人◕ ‿‿ ◕人＼</h1>`);
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.info(`server listening at http://localhost:3000 ／人◕ ‿‿ ◕人＼`);
});
