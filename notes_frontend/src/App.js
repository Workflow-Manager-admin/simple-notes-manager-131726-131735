import React, { useState, useEffect } from "react";
import "./App.css";

// Color scheme for minimalistic, light theme
const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ffb300",
  bgSidebar: "#f4f6fa",
  bgMain: "#ffffff",
  text: "#222",
  placeholder: "#aaa"
};

// Helper for REST API placeholders
const api = {
  // PUBLIC_INTERFACE
  async listNotes(query = "") {
    /** List notes, filtered by search query. Placeholder for REST API call */
    // return await fetch(`/api/notes?search=${encodeURIComponent(query)}`).then(res => res.json());
    // Placeholder sample data:
    return [
      { id: 1, title: "Welcome Note", content: "Start writing your first note!" },
      { id: 2, title: "Meeting", content: "Discuss project milestones." }
    ].filter(
      (n) =>
        n.title.toLowerCase().includes(query.toLowerCase().trim()) ||
        n.content.toLowerCase().includes(query.toLowerCase().trim())
    );
  },
  // PUBLIC_INTERFACE
  async getNote(id) {
    /** Get note by ID. Placeholder for REST API call */
    // return await fetch(`/api/notes/${id}`).then(res => res.json());
    return { id, title: "Note " + id, content: "..." };
  },
  // PUBLIC_INTERFACE
  async createNote(note) {
    /** Create note. Placeholder for REST API call */
    // return await fetch(`/api/notes`, {method: "POST",body: JSON.stringify(note)}).then(res => res.json());
    return { ...note, id: Math.floor(Math.random() * 10000) };
  },
  // PUBLIC_INTERFACE
  async updateNote(id, note) {
    /** Update note. Placeholder for REST API call */
    // return await fetch(`/api/notes/${id}`, { method: "PUT", body: JSON.stringify(note) }).then(res => res.json());
    return { ...note, id };
  },
  // PUBLIC_INTERFACE
  async deleteNote(id) {
    /** Delete note. Placeholder for REST API call */
    // return await fetch(`/api/notes/${id}`, { method: "DELETE" });
    return true;
  }
};


// PUBLIC_INTERFACE
function App() {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [noteInput, setNoteInput] = useState({ title: "", content: "" });
  const [search, setSearch] = useState("");
  const [theme] = useState("light"); // Only light theme as per requirements
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mainNote = notes.find((n) => n.id === selectedId) || null;

  // Load notes (with search)
  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .listNotes(search)
      .then((data) => {
        setNotes(data);
        // Select first note if needed
        if (!data.some((note) => note.id === selectedId)) {
          setSelectedId(data.length ? data[0].id : null);
          setEditing(false);
        }
      })
      .catch(() => setError("Failed to load notes"))
      .finally(() => setLoading(false));
  }, [search]);

  // Handlers for CRUD and UI
  // PUBLIC_INTERFACE
  function handleSelect(id) {
    setSelectedId(id);
    setEditing(false);
  }

  // PUBLIC_INTERFACE
  function handleEdit() {
    const note = notes.find((n) => n.id === selectedId);
    setNoteInput({
      title: note?.title ?? "",
      content: note?.content ?? ""
    });
    setEditing(true);
  }

  // PUBLIC_INTERFACE
  function handleNew() {
    setNoteInput({ title: "", content: "" });
    setSelectedId(null);
    setEditing(true);
  }

  // PUBLIC_INTERFACE
  async function handleDelete(id) {
    if (!window.confirm("Delete this note?")) return;
    await api.deleteNote(id);
    setNotes((curr) => curr.filter((n) => n.id !== id));
    setEditing(false);
    setSelectedId((currSel) => {
      const idx = notes.findIndex((n) => n.id === id);
      if (idx > 0) return notes[idx - 1].id;
      if (idx === 0 && notes.length > 1) return notes[1].id;
      return null;
    });
  }

  // PUBLIC_INTERFACE
  async function handleSave(e) {
    e.preventDefault();
    if (!noteInput.title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let saved;
      if (selectedId) {
        saved = await api.updateNote(selectedId, noteInput);
        setNotes((curr) =>
          curr.map((n) => (n.id === selectedId ? { ...saved } : n))
        );
        setSelectedId(saved.id);
      } else {
        saved = await api.createNote(noteInput);
        setNotes((curr) => [{ ...saved }, ...curr]);
        setSelectedId(saved.id);
      }
      setEditing(false);
    } catch (e) {
      setError("Failed to save note");
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  function handleInputChange(evt) {
    const { name, value } = evt.target;
    setNoteInput((prev) => ({ ...prev, [name]: value }));
  }

  // PUBLIC_INTERFACE
  function handleSearch(e) {
    setSearch(e.target.value);
  }

  // Styling as JS for simplicity (applies light/minimal aesthetic)
  const styles = {
    root: {
      display: "flex",
      minHeight: "100vh",
      background: COLORS.bgSidebar
    },
    sidebar: {
      flexBasis: 280,
      background: COLORS.bgSidebar,
      borderRight: `1px solid #ececec`,
      display: "flex",
      flexDirection: "column",
      minWidth: 200
    },
    sidebarHeader: {
      display: "flex",
      alignItems: "center",
      padding: "1rem",
      color: COLORS.primary,
      fontWeight: 700,
      fontSize: 21,
      borderBottom: `1px solid #eee`
    },
    searchBox: {
      margin: "1rem",
      border: "none",
      padding: "10px 16px",
      borderRadius: 5,
      background: "#fff",
      color: COLORS.text,
      fontSize: 15,
      outline: "none",
      borderBottom: `2px solid ${COLORS.primary}`,
      marginBottom: 6
    },
    notesList: {
      flex: 1,
      overflowY: "auto"
    },
    noteItem: (active) => ({
      cursor: "pointer",
      padding: "14px 20px",
      background: active ? "#e3ebf6" : "transparent",
      borderLeft: active ? `4px solid ${COLORS.primary}` : "4px solid transparent",
      borderBottom: "1px solid #f0f0f0",
      color: COLORS.text,
      fontWeight: active ? 600 : 400,
      transition: "background 0.16s"
    }),
    main: {
      flex: 1,
      background: COLORS.bgMain,
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    },
    mainHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: `1px solid #eee`,
      padding: "1.1rem 2rem 1.1rem 1.1rem"
    },
    noteTitle: {
      fontSize: 25,
      fontWeight: 600,
      color: COLORS.primary
    },
    noteActions: {
      display: "flex",
      gap: 8
    },
    accentBtn: {
      background: COLORS.accent,
      color: "#fff",
      fontWeight: 600,
      border: "none",
      borderRadius: 5,
      padding: "7px 15px",
      cursor: "pointer",
      fontSize: 16
    },
    primaryBtn: {
      background: COLORS.primary,
      color: "#fff",
      fontWeight: 500,
      border: "none",
      borderRadius: 5,
      padding: "7px 15px",
      cursor: "pointer",
      fontSize: 16
    },
    dangerBtn: {
      background: "#fa5252",
      color: "#fff",
      fontWeight: 500,
      border: "none",
      borderRadius: 5,
      padding: "7px 15px",
      cursor: "pointer",
      fontSize: 16
    },
    noteContent: {
      padding: "2.2rem",
      fontSize: 18,
      whiteSpace: "pre-wrap",
      color: "#222"
    },
    emptyState: {
      color: COLORS.placeholder,
      textAlign: "center",
      marginTop: "25%"
    },
    formField: {
      margin: "1rem 0",
      display: "flex",
      flexDirection: "column"
    },
    inputTitle: {
      fontSize: 21,
      padding: "12px",
      marginBottom: "0.5rem",
      border: `1px solid #ddd`,
      borderRadius: 4,
      fontWeight: 500,
      color: COLORS.text
    },
    textarea: {
      fontSize: 16,
      padding: "12px",
      minHeight: 110,
      border: `1px solid #ddd`,
      borderRadius: 4,
      color: COLORS.text,
      marginBottom: "0.8rem"
    }
  };

  // Responsive adjustment
  const mobile = window.innerWidth < 680;

  return (
    <div className="NotesAppRoot" style={styles.root}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span role="img" aria-label="">📝</span> &nbsp;Notes
          <button
            style={{
              ...styles.accentBtn,
              marginLeft: "auto",
              fontSize: 14,
              padding: "6px 10px"
            }}
            onClick={handleNew}
            aria-label="Create Note">
            + New
          </button>
        </div>
        <input
          style={styles.searchBox}
          type="text"
          placeholder="Search notes…"
          value={search}
          onChange={handleSearch}
          aria-label="Search notes"
        />
        <div style={styles.notesList}>
          {loading && (
            <div style={styles.emptyState}>Loading…</div>
          )}
          {!loading && notes.length === 0 && (
            <div style={styles.emptyState}>No notes found.</div>
          )}
          {!loading &&
            notes.map((note) => (
              <div
                key={note.id}
                style={styles.noteItem(note.id === selectedId)}
                onClick={() => handleSelect(note.id)}
                aria-current={note.id === selectedId}
              >
                <span style={{
                  fontWeight: 600, color: COLORS.primary, marginRight: 8
                }}>•</span>
                {note.title.length > 24
                  ? note.title.slice(0, 24) + "…"
                  : note.title}
              </div>
            ))}
        </div>
      </aside>
      {/* Main content */}
      <main style={styles.main}>
        <header style={styles.mainHeader}>
          <div style={styles.noteTitle}>
            {editing
              ? (selectedId ? "Edit Note" : "New Note")
              : (mainNote ? mainNote.title : "No Note Selected")}
          </div>
          <div style={styles.noteActions}>
            {!editing && mainNote && (
              <>
                <button style={styles.primaryBtn} onClick={handleEdit}>
                  Edit
                </button>
                <button
                  style={styles.dangerBtn}
                  onClick={() => handleDelete(mainNote.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </header>
        <section style={{ flex: 1, minHeight: 0 }}>
          {error && (
            <div
              style={{
                background: "#fa5252",
                color: "#fff",
                padding: 14,
                marginBottom: 24,
                borderRadius: 4,
                textAlign: "center",
                margin: 18
              }}
            >
              {error}
            </div>
          )}
          {editing ? (
            <form
              onSubmit={handleSave}
              style={{
                maxWidth: 540,
                margin: "2.5rem auto",
                background: "#fafbfc",
                padding: "2.5rem 1.5rem",
                borderRadius: 8,
                boxShadow: "0 2px 10px 0 rgba(200,220,255,0.12)",
                border: "1px solid #eee"
              }}
              autoComplete="off"
            >
              <div style={styles.formField}>
                <label htmlFor="title" style={{ fontWeight: 500, color: COLORS.primary }}>
                  Title
                </label>
                <input
                  style={styles.inputTitle}
                  id="title"
                  name="title"
                  value={noteInput.title}
                  onChange={handleInputChange}
                  placeholder="Enter note title"
                  maxLength={50}
                  required
                  autoFocus
                />
              </div>
              <div style={styles.formField}>
                <label htmlFor="content" style={{ fontWeight: 500, color: COLORS.secondary }}>
                  Content
                </label>
                <textarea
                  style={styles.textarea}
                  id="content"
                  name="content"
                  value={noteInput.content}
                  onChange={handleInputChange}
                  placeholder="Write your note here…"
                  rows={7}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  style={styles.primaryBtn}
                  type="submit"
                  disabled={loading}
                  aria-label="Save Note"
                >
                  Save
                </button>
                <button
                  style={styles.dangerBtn}
                  type="button"
                  onClick={() => setEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : mainNote ? (
            <div style={styles.noteContent}>
              {mainNote.content || (
                <span style={styles.emptyState}>No content.</span>
              )}
            </div>
          ) : (
            <div style={styles.emptyState}>
              Select a note, or create a new one to get started!
            </div>
          )}
        </section>
      </main>
      <style>
        {`
        @media (max-width: 900px) {
          .NotesAppRoot {
            flex-direction: column;
          }
          aside {
            flex-basis: auto !important; min-width: 0 !important;
            border-right: none !important;
            border-bottom: 1px solid #ececec;
          }
        }
        @media (max-width: 650px) {
          .NotesAppRoot {
            flex-direction: column;
          }
          aside {
            flex-basis: 48vw !important;
            min-width: 0 !important;
            max-width: none !important;
          }
          main {
            padding: 0 !important;
          }
        }
        `}
      </style>
    </div>
  );
}

export default App;
