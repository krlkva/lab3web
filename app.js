export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
  const app = express();

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    next();
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/login/', (req, res) => {
    res.send('lisakorolkova');
  });

  app.get('/code/', (req, res) => {
    const filePath = import.meta.url.substring(7);
    const stream = createReadStream(filePath);
    stream.pipe(res);
  });

  app.get('/sha1/:input/', (req, res) => {
    const input = req.params.input;
    const hash = crypto.createHash('sha1').update(input).digest('hex');
    res.send(hash);
  });

  app.get('/req/', (req, res) => {
    const addr = req.query.addr;
    if (!addr) {
      res.status(400).send('addr parameter required');
      return;
    }
    http.get(addr, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        res.send(data);
      });
    }).on('error', () => {
      res.status(500).send('Error fetching resource');
    });
  });

  app.post('/req/', (req, res) => {
    const addr = req.body.addr;
    if (!addr) {
      res.status(400).send('addr parameter required');
      return;
    }
    http.get(addr, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        res.send(data);
      });
    }).on('error', () => {
      res.status(500).send('Error fetching resource');
    });
  });

  app.all('*', (req, res) => {
    res.send('lisakorolkova');
  });

  return app;
}
