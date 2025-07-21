import { useEffect, useState } from 'react'
import Note from './components/Note'
import noteService from './services/notes'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)


 const hook = () => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }

  useEffect(hook, [])

  console.log('render', notes.length, 'notes');
  

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1),
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
    
    
  }

  const handleNoteChange = (event) => {

    console.log('button clicked', event.target.value);
    setNewNote(event.target.value)
  }
  const handleShowAll = () => {
    const show = showAll
    setShowAll(!show)
  }

  const show = showAll ? 'important' : 'all'


  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changeNote = { ...note, important: !note.important }

    noteService
      .update(id, changeNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
    })
      .catch(error => {
        alert(
          `the note '${note.content}' was already deleted from the server`
        )
        setNotes(notes.filter(n => n.id !== id))
      })

  }


  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={handleShowAll}>
          show {show}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
        <Note key={note.id} note={note}
        toggleImportance={() => toggleImportanceOf(note.id)}
        />
        )}
      
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App