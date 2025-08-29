import { useEffect, useState, useRef } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'




const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)






  const handleLogin = async (event) => {
    event.preventDefault()


    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials', exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const hook = () => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }

  useEffect(hook, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])


  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const addNote = (noteObject) => {
    console.log('it hit here')
    noteFormRef.current.toggleVisibility()

    noteService
      .create(noteObject)
      .then(returnedNote => {
        console.log(returnedNote)
        setNotes(notes.concat(returnedNote))
      })
  }


  const noteFormRef = useRef()

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm
        createNote={addNote}
      />
    </Togglable>
  )

  const handleShowAll = () => {
    const show = showAll
    setShowAll(!show)
  }

  const show = showAll ? 'important' : 'all'





  const toggleImportanceOf = (id) => {
    console.log('hit here')

    const note = notes.find(n => n.id === id)
    console.log(note)

    const changeNote = { ...note, important: !note.important }

    noteService
      .update(id, changeNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        console.log(error)


        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }


  const loginForm = () => {
    return (
      <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
      }


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
      <Footer />
    </div>
  )
}

export default App