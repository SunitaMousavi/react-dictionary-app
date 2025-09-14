import React from "react";

export default function Synonyms(props) {
  if (props.synonyms && props.synonyms.length > 0) {
    return (
      <div className="Synonyms">
        <strong>Synonyms:</strong>

        <ul>
          {props.synonyms.map(function (synonym, index) {
            return (
              <li key={index} className="synonym">
                {synonym}
              </li>
            );
          })}
        </ul>
      </div>
    );
  } else {
    return null;
  }
}
