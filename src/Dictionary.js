import React, { useState } from "react";
import axios from "axios";
import Results from "./Results";
import "./Dictionary.css";

export default function Dictionary() {
  let [keyword, setKeyword] = useState("");
  let [results, setResults] = useState(null);
  let [loading, setLoading] = useState(false);

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
      <Results results={results} />
    </div>
  );
}
