import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });
import { app } from '../src/app/api/tools-langgraph/route';
console.log("Environment variables loaded.");
console.log(process.env.GOOGLE_API_KEY);

console.log("Drawing the agent workflow graph...");
const run = async () => {
  console.log("Generating graph representation...");
  const representation = await app.getGraphAsync()
  console.log(representation);
}
// run();
