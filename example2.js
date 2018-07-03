const http = require("http")

const server = http.createServer((req, res) => {
    res.writeHead(200)
    res.end("Ok")
})

server.listen(3000);

process.on("SIGINT", () => {
    console.log("SIGINT")
    server.close();
})


process.on("SIGTERM", () => {
    console.log("SIGTERM")
    server.close();
})

// node 