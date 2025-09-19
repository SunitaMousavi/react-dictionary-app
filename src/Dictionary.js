import React, { useEffect, useState } from "react";
import axios from "axios";
import Results from "./Results";
import SavedWords from "./SavedWords";
import "./Dictionary.css";

export default function Dictionary() {
  const [keyword, setKeyword] = useState(""); // The word typed by the user.
  const [results, setResults] = useState(null); // Stores the API response for the searched word.
  const [savedWords, setSavedWords] = useState([]); // List of words saved by the user (persists with localStorage).
  const [loading, setLoading] = useState(false); // Tracks whether a search is in progress.

  // load saved words from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedWords")) || [];
    setSavedWords(saved);
  }, []);

  // Search & API Handling
  function Search(event) {
    event.preventDefault();
    setLoading(true);
    // documentation: https://dictionaryapi.dev/
    let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`;
    axios
      .get(apiUrl)
      .then((response) => {
        handleResponse(response);
        setLoading(false);
      })
      .catch(() => {
        setResults(null);
        setLoading(false);
        alert(
          "Sorry, we couldn't find the word you were looking for. Please try again."
        );
      });
  }

  function handleResponse(response) {
    setResults(response.data[0]);
  }

  // Updates keyword as the user types.
  function handleKeywordChange(event) {
    setKeyword(event.target.value);
  }

  // Save the **full results object**
  function saveWord(results) {
    if (!results || !results.word) return;

    setSavedWords((prev) => {
      const duplicate = prev.some(
        (w) => w.word.trim().toLowerCase() === results.word.trim().toLowerCase()
      );
      if (duplicate) {
        alert(`The word "${results.word}" is already saved.`);
        return prev;
      }
      const next = [...prev, results];
      localStorage.setItem("savedWords", JSON.stringify(next));
      return next;
    });
  }

  // Clear all saved words
  function clearSavedWords() {
    if (!window.confirm("Are you sure you want to clear all saved words?"))
      return;
    localStorage.removeItem("savedWords");
    setSavedWords([]);
  }

  // Export to CSV (for flashcards like Anki)
  function exportCSV(data, filename) {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  // Build flashcard content from saved words
  function handleExportFlashcards() {
    const rows = [["Front", "Back"]];

    savedWords.forEach((w) => {
      let back = "";

      w.meaning?.forEach((meaning) => {
        meaning.definitions?.forEach((def) => {
          back += `<b>${meaning.partOfSpeech}</b> - ${def.definition}`;
          if (def.example) back += `<br><i>Example:</i> ${def.example}`;
          if (def.synonyms?.length)
            back += `<br><i>Synonyms:</i> ${def.synonyms.join(", ")}`;
          back += "<br>";
        });
      });
      w.phonetics?.forEach((p) => {
        if (p.audio) back += `<br><audio controls src="${p.audio}"></audio>`;
      });
      rows.push([w.word, back]);
    });
    exportCSV(rows, "flashcards.csv");
  }

  return (
    <div className="Dictionary">
      <form onSubmit={Search}>
        <input
          type="search"
          placeholder="Type a word..."
          autoFocus={true}
          onChange={handleKeywordChange}
        />
        <input type="submit" value="Search" />
      </form>

      {loading && <p>Loading...</p>}

      <Results results={results} onSave={saveWord} />

      <SavedWords
        savedWords={savedWords}
        onExport={handleExportFlashcards} // only one export
        onRemove={(word) =>
          setSavedWords((prev) => {
            const next = prev.filter((w) => w.word !== word);
            localStorage.setItem("savedWords", JSON.stringify(next));
            return next;
          })
        }
        onClear={clearSavedWords}
      />
    </div>
  );
}