import app from "./app";

/**
 * server initialization
 */

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`API available on port ${port}`));
