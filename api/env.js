import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('ERROR: GOOGLE_CLIENT_ID is missing. Check your .env file and dotenv config.');
  process.exit(1);
}
