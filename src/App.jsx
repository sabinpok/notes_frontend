import { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import noteService from "./services/notes";
import loginService from "./services/login";

const App = () => {
  const [notes, setNotes] = useState([]); // state for the entire list of notes
  const [newNote, setNewNote] = useState(""); // state for the current note being entered in the text field
  const [showAll, setShowAll] = useState(true); // state for showing all notes or only important notes
  const [errorMessage, setErrorMessage] = useState(null); // state for displaying error messages
  const [username, setUsername] = useState(""); // state for the username
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // useEffect hook is used to fetch all notes from the server when the component is rendered
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  // addNote function is used to add a new note to the server
  const addNote = (event) => {
    event.preventDefault(); // prevent the default action of the event, aka form submission reloading the page
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };

    // create method from noteService is used to add a new note to the server
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote)); // update the notes state with the new note
      setNewNote("");
    });
  };

  // toggleImportanceOf function is used to toggle the importance of a note
  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id); // find the note with the given id

    // ...note is used to copy the note object
    const changedNote = { ...note, important: !note.important }; // create a new note object with the opposite importance value

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote))); // update the notes state by replacing the original note with the updated note
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  // handleNoteChange function updates newNote state to current input in text field
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  );

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
      )}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
