import React from "react";
import Meanings from "./Meanings";
import Phonetics from "./Phonetics";

export default function Results({ results, onSave }) {
  // If there’s no result yet, render nothing (null).
  if (!results) return null;

  return (
    <div className="Results">
      <h1>{results.word}</h1>

      {/* Save the FULL results object */}
      <button onClick={() => onSave(results)}>Save word</button>

      {results.phonetics?.map((phonetic, index) => (
        <div key={index}>
          <Phonetics phonetic={phonetic} />
        </div>
      ))}

      {results.meanings?.map((meaning, index) => (
        <div key={index}>
          <Meanings meaning={meaning} />
        </div>
      ))}
    </div>
  );
}