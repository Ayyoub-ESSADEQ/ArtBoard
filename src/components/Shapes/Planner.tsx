import { useState } from "react";

function Planner() {
  const [notes, setNotes] = useState([["hello world"]]);
  const addNewNote = (index: number) => {
    const newNotes = [...notes];
    newNotes[index].push("new");
    setNotes(newNotes);
  };

  return (
    <foreignObject style={{ overflow: "visible" }} x={0} y={0}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "fit-content",
          columnGap: "10px",
        }}
      >
        {notes.map((note, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "fit-content",
                rowGap: "10px",
              }}
            >
              {note.map((note, index) => (
                <div
                  key={index}
                  style={{
                    width: 100,
                    minHeight: 100,
                    backgroundColor: "yellow",
                  }}
                  contentEditable
                  suppressContentEditableWarning
                >
                  {" "}
                  {note}
                </div>
              ))}
              <div
                onClick={() => addNewNote(index)}
                style={{
                  width: 100,
                  height: 20,
                  backgroundColor: "red",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                +
              </div>
            </div>
          );
        })}
      </div>

      <div
        onClick={() => setNotes([...notes, ["new"]])}
        style={{
          width: 20,
          height: 100,
          backgroundColor: "red",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        +
      </div>
    </foreignObject>
  );
}

export default Planner;
