const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))


// const cors = require('cors')
// app.use(cors())



let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:', request.path)
//   console.log('Body:', request.body)
//   console.log('---')
// }

app.use(express.json())
// app.use(requestLogger)

const logger = morgan('combined')
app.use(logger)





app.get('/', (request, response) => {
  response.send('<h1>Hello World!<h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})



app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)

  if (note) {
    response.json(note)

  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => Number(n.id)))
  : 0
  return String(maxId + 1)
}

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})