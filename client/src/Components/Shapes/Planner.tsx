import { useState } from "react";

export function Planner() {
  const [notes, setNotes] = useState([["hello world"]]);
  const addNewNote = (index: number) => {
    const newNotes = [...notes];
    newNotes[index].push("new");
    setNotes(newNotes);
  };

  return (
    <foreignObject style={{ overflow: "visible" }} x={0} y={0}>
      <div className="flex flex-row w-fit gap-2">
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
                      width: 175,
                      minHeight: 175,
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
          className="w-[50px] h-[100px] bg-red-400 items-center justify-center"
        >
          +
        </div>
      </div>
    </foreignObject>
  );
}
