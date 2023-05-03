const http = require("http");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function startServer(htmlPath, dataPath) {
  let htmlTemplate;
  try {
    htmlTemplate = fs.readFileSync(htmlPath, "utf8");
  } catch (err) {
    console.error(`Error reading HTML template file: ${err.message}`);
    rl.close();
    return;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  } catch (err) {
    console.error(`Error reading data file: ${err.message}`);
    rl.close();
    return;
  }

  http
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });

      let html = htmlTemplate;
      for (let key in data) {
        if (typeof data[key] === "string") {
          html = html.replace(new RegExp("{{" + key + "}}", "g"), data[key]);
        } else {
          let htmlContent = "";

          data[key].forEach((item) => {
            htmlContent += `<div class="card">
              <img
                class="card-img"
                src=${item.img}
                alt="Player image"
              />
       
                <h3 class="card-title">${item.Name}</h3>
                <div class="card-text">
                <p class="card-content">
                  <span class="card-content-title">Sport</span>: ${item.Sport}
                </p>
                <p class="card-content">
                  <span class="card-content-title">Country</span>: ${
                    item.Country
                  }
                </p>
                ${
                  item.Prime_team
                    ? `<p class="card-content">
                <span class="card-content-title">Prime-team</span>: ${item.Prime_team}
              </p>`
                    : ""
                }
              
              </div>
            </div>`;
          });
          html = html.replace(new RegExp("{{" + key + "}}", "g"), htmlContent);
        }
      }

      res.end(html);
    })
    .listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
}

rl.question("Enter the path to the HTML template: ", (htmlPath) => {
  rl.question("Enter the path to the data file: ", (dataPath) => {
    startServer(htmlPath, dataPath);
    rl.close();
  });
});
