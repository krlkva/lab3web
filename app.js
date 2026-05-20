export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
  const app = express();

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, ngrok-skip-browser-warning');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send();
      return;
    }
    
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

  const handleReq = (req, res) => {
    const addr = req.method === 'GET' ? req.query.addr : req.body.addr;
    
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
  };

  app.get('/req/', handleReq);
  app.post('/req/', handleReq);

  app.all('*', (req, res) => {
    res.send('lisakorolkova');
  });

  return app;
}
