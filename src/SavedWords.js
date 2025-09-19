import React from "react";

export default function SavedWords({
  savedWords,
  onExportFull,
  onExportAnki,
  onRemove,
  onClear,
}) {
  return (
    <div className="SavedWords">
      <h2>Saved Words ({savedWords.length})</h2>

      {savedWords.length === 0 ? (
        <p>No saved words yet — click “Save word” to add one.</p>
      ) : (
        <>
          <div>
            <button onClick={onExportFull}>Export CSV</button>
            <button onClick={onExportAnki}>Export Anki</button>
            <button onClick={onClear}>Clear all</button>
          </div>

          <ul>
            {savedWords.map((w) => (
              <li key={w.word}>
                <div>
                  <strong>{w.word}</strong>
                  <div>
                    {w.definition && <span>{w.definition}</span>}
                    {w.example && <div>&ldquo;{w.example}&rdquo;</div>}
                    {w.synonyms && w.synonyms.length > 0 && (
                      <div>
                        <strong>Syn:</strong> {w.synonyms.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => onRemove(w.word)}
                    aria-label={`Remove ${w.word}`}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
