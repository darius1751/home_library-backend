import express from 'express';
const main = async () => {
    const app = express();
    const port = 4000;
    app.listen(port, () => {
        console.log(`Run app in port: ${port} PI`)
    });
}
main();