// // import { drizzle } from "drizzle-orm/postgres-js";
// // import postgres from "postgres";

// // const client = postgres(process.env.DATABASE_URL);

// // export const db = drizzle(client);



// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";


// import * as relations from "./relation.js";
// import * as tables from "./index.js";

// import dotenv from "dotenv";

// dotenv.config();
 

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// export const db = drizzle(pool, {
//   schema: {
//     ...tables,
//     ...relations,
//   },
// });


import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema/schema.js";
import * as relations from "./relation.js";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    ...schema,
    ...relations,
  },
});