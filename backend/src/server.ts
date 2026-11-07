import "temporal-polyfill/global";
import app from "./app";

app.listen(process.env["PORT"], () => {
  console.log(`Server is Running ${process.env["PORT"]}`);
});
