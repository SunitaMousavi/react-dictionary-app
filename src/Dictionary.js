import React, { useState } from "react";
import axios from "axios";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// React-Bootstrap Spinner
import Spinner from "react-bootstrap/Spinner";

// Components
import Results from "./Results";
import SavedWords from "./SavedWords";

export default function Dictionary() {
  // STATE
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedWords, setSavedWords] = useState([]);

  // Update input field
  function handleKeywordChange(event) {
    setKeyword(event.target.value);
  }

  // Search API
  async function Search(event) {
    event.preventDefault();
    if (!keyword) return;
    setLoading(true);

    try {
      const apiKey = `f9006f5eft0a33fd9693b7da488a8o99`;
      const response = await axios.get(
        `https://api.shecodes.io/dictionary/v1/define?word=${keyword}&key=${apiKey}`
      );
      setResults(response.data[0]);
    } catch (error) {
      setResults(null);
      alert(
        "Sorry, we couldn't find the word you were looking for. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Save, Remove, Clear, Export handlers (same as before)
  function handleSave(wordData) {
    if (wordData.remove) {
      setSavedWords(savedWords.filter((item) => item.word !== wordData.word));
    } else if (!savedWords.some((item) => item.word === wordData.word)) {
      setSavedWords([...savedWords, wordData]);
    }
  }

  function handleRemove(word) {
    setSavedWords(savedWords.filter((item) => item.word !== word));
  }

  function handleClear() {
    setSavedWords([]);
  }

  function handleExport() {
    const headers = ["Front", "Back"];
    const rows = savedWords.map((item) => {
      const word = `${item.word}`;
      const phonetic =
        item.phonetic ||
        (item.meanings[0]?.phonetic ? item.meanings[0].phonetic : "");
      const front = `${word}${phonetic ? "\n" + phonetic : ""}`;

      const backParts = item.meanings.map((m) => {
        const definition = `• ${m.partOfSpeech}: ${m.definitions[0]?.definition}`;
        const examples = m.definitions
          .slice(0, 2)
          .map((d, idx) => `• Example ${idx + 1}: ${d.example || "(none)"}`)
          .join("\n");
        const collocations = m.collocations
          ? `• Collocations: ${m.collocations.join(", ")}`
          : "";
        const synonyms = m.synonyms?.length
          ? `• Synonyms: ${m.synonyms.join(", ")}`
          : "";
        const antonyms = m.antonyms?.length
          ? `• Antonyms: ${m.antonyms.join(", ")}`
          : "";
        const morphology = m.morphology ? `• Morphology: ${m.morphology}` : "";

        return [
          definition,
          examples,
          collocations,
          synonyms,
          antonyms,
          morphology,
        ]
          .filter(Boolean)
          .join("\n");
      });

      const back = backParts.join("\n\n");
      return [front, back];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => `"${e[0]}","${e[1].replace(/"/g, '""')}"`)
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "flashcards.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // RENDER
  return (
    <div className="Dictionary">
      <div className="search-form">
        <form onSubmit={Search}>
          <input
            type="search"
            placeholder="Type a word..."
            autoFocus={true}
            onChange={handleKeywordChange}
            className="search-input"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" />
          </button>
        </form>
      </div>

      <Results results={results} onSave={handleSave} savedWords={savedWords} />

      {loading && (
        <div className="spinner-container">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      <SavedWords
        savedWords={savedWords}
        onRemove={handleRemove}
        onClear={handleClear}
        onExport={handleExport}
      />
    </div>
  );
}
