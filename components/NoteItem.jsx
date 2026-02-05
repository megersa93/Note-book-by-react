import React, { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

// NoteItem: displays a single note with inline editing and actions
export function NoteItem({ note, onUpdate, onDelete, icons }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const saveEdit = () => {
    if (!title.trim()) return;
    onUpdate({ title: title.trim(), content: content.trim() });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  const formatDate = (ts) =>
    new Date(ts).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <li className="note-item">
      <div className="note-head">
        {isEditing ? (
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
        ) : (
          <h3 className="note-title">{note.title}</h3>
        )}
        <div className="note-actions">
          {!isEditing ? (
            <>
              <button className="icon-btn" title="Edit note" onClick={() => setIsEditing(true)}>
                <FiEdit /> <span className="hide-sm">Edit</span>
              </button>
              <button className="icon-btn danger" title="Delete note" onClick={onDelete}>
                <FiTrash /> <span className="hide-sm">Delete</span>
              </button>
            </>
          ) : (
            <>
              <button className="secondary-btn" onClick={cancelEdit}>Cancel</button>
              <button className="primary-btn" onClick={saveEdit}>Save</button>
            </>
          )}
        </div>
      </div>
      <div className="note-body">
        {isEditing ? (
          <textarea
            className="textarea"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
          />
        ) : (
          <p className="note-content">{note.content || "—"}</p>
        )}
      </div>
      <div className="note-meta">
        <span className="badge">
          {icons.calendar} Created: {formatDate(note.createdAt)}
        </span>
        <span className="badge">
          {icons.clock} Updated: {formatDate(note.updatedAt)}
        </span>
      </div>
    </li>
  );
}
