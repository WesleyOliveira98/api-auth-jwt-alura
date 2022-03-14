require('dotenv').config()

const app = require('./app');
const port = 3000;
require('./database');
require('./redis/blocklist-access-token');
require('./redis/allowlist-refresh-token');

const routes = require('./rotas');
routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));
