import React from "react";
import { FaVolumeUp } from "react-icons/fa";
import useSound from "use-sound";
import "./Phonetics.css";

export default function Phonetics({ phonetic }) {
  // Always call the hook (use empty string if no audio to avoid error)
  const [play] = useSound(phonetic.audio || "", { soundEnabled: !!phonetic.audio });

  return (
    <div className="Phonetics">
      {phonetic.text && <span>{phonetic.text}</span>}
      {phonetic.audio && (
        <button onClick={play} className="play-audio-btn">
          <FaVolumeUp size={22} />
        </button>
      )}
    </div>
  );
}