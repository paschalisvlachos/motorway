const express = require('express');
const app = express();
var bodyParser = require('body-parser')


const { mainApi } = require('./api/main');
const { taskApi } = require('./api/task/task');

app.use(bodyParser.json());

const port = 8080;

// routes for the api
app.get('/api', mainApi); // main Api page
app.get('/api/task', taskApi); // Get task results

module.exports = app;

// set the app to listen on the port
// if it runs via localhost it will use http while online it will use https
if (require.main === module) {
    app.listen(process.env.PORT || port, () => {
        console.log("Express server listening on port %d in %s mode", port, app.settings.env);
    });
}
