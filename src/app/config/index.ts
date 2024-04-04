import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_uri: process.env.DB_URI,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
};
