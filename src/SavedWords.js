import React from "react";

export default function SavedWords({
  savedWords,
  onExport,
  onRemove,
  onClear,
}) {
  return (
    <div className="SavedWords">
      {/* Heading with number of saved words */}
      <h2>Saved Words ({savedWords.length})</h2>

      {/* If no words are saved, show a placeholder message */}
      {savedWords.length === 0 ? (
        <p>No saved words yet — click “Save word” to add one.</p>
      ) : (
        <>
          {/* Export and Clear All buttons */}
          <div>
            <button onClick={onExport}>Export Flashcards</button>
            <button onClick={onClear}>Clear All</button>
          </div>

          {/* Word list */}
          <ul>
            {savedWords
              .filter((w) => w && w.word) // ✅ remove null/invalid entries
              .map((w) => (
                <li key={w.word}>
                  <div>
                    <strong>{w.word}</strong>

                    {/* Only show phonetics if available */}
                    {w.phonetics && w.phonetics.length > 0 && (
                      <span style={{ marginLeft: "0.5rem", color: "#555" }}>
                        [{w.phonetics[0].text || ""}]
                      </span>
                    )}

                    {/* Meanings */}
                    {w.meanings && w.meanings.length > 0 && (
                      <p style={{ margin: "0.25rem 0" }}>
                        {w.meanings[0].partOfSpeech}:{" "}
                        {w.meanings[0].definitions[0].definition}
                      </p>
                    )}
                  </div>

                  {/* Remove button */}
                  <div style={{ marginTop: "0.25rem" }}>
                    <button onClick={() => onRemove(w.word)}>Remove</button>
                  </div>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}
