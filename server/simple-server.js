
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Port configuration
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory (frontend build)
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'));
});

// Start the server on the dynamic Render port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
