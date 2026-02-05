import React from "react";

// Header with title and right-side actions slot
export function Header({ title, right }) {
  return (
    <header className="app-header">
      <h1 className="app-title">{title}</h1>
      <div className="header-actions">{right}</div>
    </header>
  );
}
