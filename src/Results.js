import React, { useState, useEffect } from "react";
// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

export default function Results({ results, onSave, savedWords }) {
  // STATE
  const [isSaved, setIsSaved] = useState(false);

  // Update isSaved whenever results or savedWords change
  useEffect(() => {
    if (results) {
      const saved = savedWords.some((item) => item.word === results.word);
      setIsSaved(saved);
    }
  }, [results, savedWords]);

  if (!results) return null;

  // Toggle save/unsave
  const toggleSave = () => {
    if (isSaved) {
      onSave({ word: results.word, remove: true });
      setIsSaved(false);
    } else {
      onSave({
        word: results.word,
        phonetic: results.phonetic || "",
        meanings: results.meanings.map((meaning) => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: [
            {
              definition: meaning.definition,
              example: meaning.example || "",
            },
          ],
          synonyms: meaning.synonyms || [],
          antonyms: meaning.antonyms || [],
          morphology: meaning.morphology || "",
        })),
      });
      setIsSaved(true);
    }
  };

  const playAudio = () => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(results.word);
      utterance.lang = "en-US";
      utterance.rate = 0.85; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in your browser");
    }
  };

  // Render
  return (
    <div className="Results">
      {/* Word Card */}
      <div className="card word-card">
        {/* Bookmark Button */}
        <button
          onClick={toggleSave}
          aria-label={isSaved ? "Unsave word" : "Save word"}
          className="bookmark-btn">
          <FontAwesomeIcon
            icon={isSaved ? solidBookmark : regularBookmark}
            size="2xl"
          />
        </button>

        {/* Word + Phonetic + Audio */}
        <div className="word-info">
          <h2 className="word">{results.word}</h2>
          {results.phonetic && (
            <span className="phonetic-text">/{results.phonetic}/</span>
          )}
          {/* AUDIO BUTTON */}
          <button
            onClick={playAudio}
            aria-label="Pronounce word"
            className="audio-btn"
            style={{ marginLeft: "10px", cursor: "pointer" }}>
            <FontAwesomeIcon icon={faVolumeHigh} />
          </button>
        </div>
      </div>

      {/* Meanings */}
      <div className="card meanings-card">
        {results.meanings?.map((meaning, index) => (
          <div key={index} className="meaning">
            <h4 className="part-of-speech">{meaning.partOfSpeech}</h4>
            <ul className="definitions">
              <li className="definition">
                <span>{meaning.definition}</span>
                {meaning.example && <em> — {meaning.example}</em>}
              </li>
            </ul>

            {meaning.synonyms?.length > 0 && (
              <p className="synonyms">
                <strong>Synonyms:</strong> {meaning.synonyms.join(", ")}
              </p>
            )}
            {meaning.antonyms?.length > 0 && (
              <p className="antonyms">
                <strong>Antonyms:</strong> {meaning.antonyms.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
