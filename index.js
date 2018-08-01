const http = require('http')
const app = require('express')()
const knex = require('knex')({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: "./assignment.sqlite"
  }
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', (req, res) => {
  res.send('Hello world! Try the /app route for a list of appIDs.')
})

app.get('/app', (req, res) => {
  knex('assignment').select('appID').groupBy('appID')
    .then(values => res.json(values))
    .catch(err => res.status(500).send(err))
})

app.get('/app/:appID', (req, res) => {
  knex('assignment').select().where({appID: req.params.appID})
    .then(values => res.json(values))
    .catch(err => res.status(500).send(err))
})

app.get('/app/:appID/:field', (req, res) => {
  knex('assignment').select(req.params.field).where({appID: req.params.appID})
    .then(values => res.json(values))
    .catch(err => res.status(500).send(err))
})

app.get('/fields/:field', (req, res) => {
  knex('assignment').select(req.params.field).groupBy(req.params.field)
    .then(values => res.json(values))
    .catch(err => res.status(500).send(err))
});

app.get('/buildVer', (req, res) => {
  const buildName = req.query.buildName;
  knex('assignment').select('buildVer').where({buildName: buildName}).groupBy('buildVer')
    .then(values => res.json(values))
    .catch(err => res.status(500).send(err))
});

app.get('/buildVer/:field', (req, res) => {
  const buildVer = req.query.buildVer;
  knex('assignment').select(req.params.field).where({buildVer: buildVer})
    .then(values => res.json(values))
    .catch(err => res.status(500).send(err))
});

app.get('/fields', (req, res) => {
  knex('assignment').columnInfo()
    .then(fields => res.json(Object.keys(fields)))
    .catch(err => res.status(500).send(err))
})

console.log('App listening on http://localhost:3000')
app.listen(process.env.PORT || 5000)
