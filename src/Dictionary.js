import React, { useEffect, useState } from "react";
import axios from "axios";
import Results from "./Results";
import SavedWords from "./SavedWords";
import "./Dictionary.css";

export default function Dictionary() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState(null);
  const [savedWords, setSavedWords] = useState([]);
  const [loading, setLoading] = useState(false);

  // load saved words from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedWords")) || [];
    setSavedWords(saved);
  }, []);

  function handleResponse(response) {
    setResults(response.data[0]);
  }

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
      .catch((error) => {
        setResults(null);
        setLoading(false);
        alert(
          "Sorry, we couldn't find the word you were looking for. Please try again."
        );
      });
  }

  function handleKeywordChange(event) {
    setKeyword(event.target.value);
  }

  function saveWord(wordObj) {
    if (!wordObj || !wordObj.word) return;

    setSavedWords((prev) => {
      const duplicate = prev.some(
        (w) => w.word.trim().toLowerCase() === wordObj.word.trim().toLowerCase()
      );
      if (duplicate) {
        alert(`The word "${wordObj.word}" is already saved.`);
        return prev;
      }
      const next = [...prev, wordObj];
      localStorage.setItem("savedWords", JSON.stringify(next));
      return next;
    });
  }

  function clearSavedWords() {
    if (!window.confirm("Are you sure you want to clear all saved words?"))
      return;
    localStorage.removeItem("savedWords");
    setSavedWords([]);
  }
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

  function handleExportFull() {
    const rows = [["Word", "Definition", "Example", "Synonyms"]];
    savedWords.forEach((w) => {
      rows.push([
        w.word,
        w.definition || "",
        w.example || "",
        w.synonyms ? w.synonyms.join("; ") : "",
      ]);
    });
    exportCSV(rows, "saved_words.csv");
  }

  function handleExportAnki() {
    const rows = [["Front", "Back"]];
    savedWords.forEach((w) => {
      const back = `${w.definition || ""}${w.example ? " — " + w.example : ""}`;
      rows.push([w.word, back]);
    });
    exportCSV(rows, "anki_words.csv");
  }

  return (
    <div className="Dictionary">
      <form onSubmit={Search}>
        <input
          type="search"
          placeholder="Type a word..."
          autoFocus="on"
          onChange={handleKeywordChange}
        />
        <input type="submit" value="Search" />
      </form>
      {loading && <p>Loading...</p>}
      <SavedWords
        savedWords={savedWords}
        onExportFull={handleExportFull}
        onExportAnki={handleExportAnki}
        onRemove={(word) =>
          setSavedWords((prev) => {
            const next = prev.filter((w) => w.word !== word);
            localStorage.setItem("savedWords", JSON.stringify(next));
            return next;
          })
        }
        onClear={clearSavedWords}
      />
      <Results results={results} onSave={saveWord} />{" "}
    </div>
  );
}
