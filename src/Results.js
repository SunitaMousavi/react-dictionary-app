import React from "react";
import Meanings from "./Meanings";
import Phonetics from "./Phonetics";

export default function Results({ results, onSave }) {
  if (!results) return null;

  // pick the first meaning/definition/example to store
  const firstMeaning = results.meanings?.[0];
  const firstDef = firstMeaning?.definitions?.[0];

  const wordObj = {
    word: results.word,
    definition: firstDef?.definition || "",
    example: firstDef?.example || "",
    synonyms: firstDef?.synonyms || [],
  };

  return (
    <div className="Results">
      <h1>{results.word}</h1>

      <button onClick={() => onSave(wordObj)}>Save word</button>

      {results.phonetics.map((phonetic, index) => (
        <div key={index}>
          <Phonetics phonetic={phonetic} />
        </div>
      ))}

      {results.meanings.map((meaning, index) => (
        <div key={index}>
          <Meanings meaning={meaning} />
        </div>
      ))}
    </div>
  );
}