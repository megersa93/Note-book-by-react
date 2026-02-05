import React from "react";

// SearchBar: controlled input with icon
export function SearchBar({ value, onChange, placeholder, icon }) {
  return (
    <div className="search-bar">
      <span className="search-icon">{icon}</span>
      <input
        className="input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search notes"
      />
    </div>
  );
}
