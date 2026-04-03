import { env } from "./config/env";
import { app } from "./app";

app.listen(env.PORT, () => {
  console.log(`VANI API listening on http://localhost:${env.PORT}`);
});
