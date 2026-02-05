import React, { useState } from "react";

// NoteEditor: create or edit a note (title + content)
export function NoteEditor({ initialTitle = "", initialContent = "", onSubmit, submitLabel }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <form className="note-editor" onSubmit={handleSubmit} autoComplete="off">
      <div className="form-row">
        <label htmlFor="noteTitle">Title</label>
        <input
          id="noteTitle"
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="noteContent">Content</label>
        <textarea
          id="noteContent"
          className="textarea"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="primary-btn">{submitLabel}</button>
      </div>
    </form>
  );
}
