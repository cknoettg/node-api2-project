const express = require('express')

const PostsRouter = require('./data/routers');

const server = express();

server.use(express.json());

server.use(`/api/posts`, PostsRouter)

server.get(`/`, (req, res) => {
  res.send({ message: `It's working` })
})

const port = 5000;
server.listen(port, () => { console.log(`\n Server listening on port ${port} \n`) })