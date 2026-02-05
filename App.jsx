import React, { useEffect, useMemo, useState } from "react";
import { FiMoon, FiSun, FiPlus, FiSearch, FiCalendar, FiClock } from "react-icons/fi";
import { Header } from "./components/Header.jsx";
import { SearchBar } from "./components/SearchBar.jsx";
import { NoteEditor } from "./components/NoteEditor.jsx";
import { NoteItem } from "./components/NoteItem.jsx";
import { ConfirmDialog } from "./components/ConfirmDialog.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";

// App: top-level component responsible for notes state, theme, search, sort
export default function App() {
  // Theme persisted in localStorage
  const [theme, setTheme] = useLocalStorage("notes.theme", "light");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Notes state persisted in localStorage
  const [notes, setNotes] = useLocalStorage("notes.items", []);

  // Search and sort states
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("updated-desc"); // created-desc | updated-desc | created-asc | updated-asc

  // Delete confirmation dialog
  const [confirmState, setConfirmState] = useState({ open: false, noteId: null });

  // Apply theme at document root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Create a new note
  const createNote = (title, content) => {
    const now = Date.now();
    const note = {
      id: cryptoRandomId(),
      title: title.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [note, ...prev]);
  };

  // Update an existing note
  const updateNote = (id, updates) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              ...updates,
              updatedAt: Date.now(),
            }
          : n
      )
    );
  };

  // Delete a note with confirmation dialog
  const requestDeleteNote = (id) => setConfirmState({ open: true, noteId: id });
  const confirmDeleteNote = () => {
    setNotes((prev) => prev.filter((n) => n.id !== confirmState.noteId));
    setConfirmState({ open: false, noteId: null });
  };
  const cancelDeleteNote = () => setConfirmState({ open: false, noteId: null });

  // Filter notes by query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
        )
      : notes.slice();
    // Sort notes
    const key = sort.startsWith("created") ? "createdAt" : "updatedAt";
    const dir = sort.endsWith("asc") ? 1 : -1;
    return list.sort((a, b) => (a[key] - b[key]) * dir);
  }, [notes, query, sort]);

  return (
    <div className="app">
      <Header
        title="React Notes"
        right={
          <button
            className="icon-btn"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
            <span className="hide-sm">{theme === "dark" ? "Light" : "Dark"} Mode</span>
          </button>
        }
      />

      <section className="card card-actions">
        <div className="left-actions">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search notes by title or content"
            icon={<FiSearch />}
          />
        </div>
        <div className="right-actions">
          <label className="sort-label" htmlFor="sortBy">
            Sort by
          </label>
          <select
            id="sortBy"
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="updated-desc">Updated (newest)</option>
            <option value="updated-asc">Updated (oldest)</option>
            <option value="created-desc">Created (newest)</option>
            <option value="created-asc">Created (oldest)</option>
          </select>
        </div>
      </section>

      <section className="card">
        <NoteEditor
          onSubmit={(title, content) => createNote(title, content)}
          submitLabel={
            <>
              <FiPlus /> Add Note
            </>
          }
        />
      </section>

      <section className="card">
        <ul className="note-list" aria-live="polite">
          {filtered.length === 0 && (
            <li className="empty">No notes. Create a new one above.</li>
          )}
          {filtered.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onUpdate={(updates) => updateNote(note.id, updates)}
              onDelete={() => requestDeleteNote(note.id)}
              icons={{ calendar: <FiCalendar />, clock: <FiClock /> }}
            />
          ))}
        </ul>
      </section>

      {confirmState.open && (
        <ConfirmDialog
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDeleteNote}
          onCancel={cancelDeleteNote}
        />
      )}
    </div>
  );
}

// Simple id generator
function cryptoRandomId() {
  // Use browser crypto if available, fallback to timestamp + random
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
