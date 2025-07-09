const { spawn } = require("child_process");

function startServer() {
    console.log("Starting server...");
    const server = spawn("node", ["server.js"]);

    server.stdout.on("data", (data) => {
        console.log(`Server Output: ${data}`);
    });

    server.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    server.on("close", (code) => {
        console.log(`Server stopped with code ${code}. Restarting...`);
        startServer(); // إعادة تشغيل الخادم عند توقفه
    });
}

startServer();
