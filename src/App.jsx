import { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import noteService from "./services/notes";

const App = () => {
  const [notes, setNotes] = useState([]); // notes state
  const [newNote, setNewNote] = useState(""); // newNote state
  const [showAll, setShowAll] = useState(true); // showAll state
  const [errorMessage, setErrorMessage] = useState(null); // errorMessage state

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

  // handleNoteChange function is used to update the newNote state
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
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
