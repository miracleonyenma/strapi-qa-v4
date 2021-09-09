import { useState } from "react";
import axios from "axios";

export default function AddQuestionDialog({ closeModal }) {
  const [disable, setDisable] = useState(false);

  async function addQuestion() {
    setDisable(true);
    const qText = window.question.value;
    const user = window.user.value;

    // add question
    await axios.post("http://localhost:1337/questions", {
      qText,
      user,
    });
    setDisable(false);
    closeModal();
    location.reload();
  }

  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Question</h3>
          <span
            style={{ padding: "10px", cursor: "pointer" }}
            onClick={closeModal}
          >
            X
          </span>
        </div>
        <div className="modal-body content">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="inputField">
              <div className="label">
                <label>User</label>
              </div>
              <div>
                <input id="user" type="text" />
              </div>
            </div>
            <div className="inputField">
              <div className="label">
                <label>Question:</label>
              </div>
              <div>
                <input
                  id="question"
                  type="text"
                  placeholder="Start your question with 'What', 'How', 'Why', etc"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            disabled={disable}
            className="btn-danger"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button disabled={disable} className="btn" onClick={addQuestion}>
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
