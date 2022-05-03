import styles from "../../styles/QuestionView.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { MsgIcon } from "../../components/QuestionCard";

export const getServerSideProps = async ({ params }) => {
  const { id } = params

  const question = await axios.get(`http://localhost:1337/api/questions/${id}?populate=*`);
  const { data: { attributes: { answers } } } = question.data

  const comments = await axios.get(`http://localhost:1337/api/comments?populate=*`);
  console.log(question);
  console.log(answers);
  return {
    props: {
      id,
      question: question.data.data,
      answers: answers.data,
      comments: comments.data.data
    }
  }
}

export default function Question({ id, question, answers, comments }) {

  const router = useRouter();

  const [showAnswerQuestionSection, setAnswerQuestionSection] = useState(false);

  async function deleteQuestion() {
    if (confirm("Do you really want to delete this question?")) {
      await axios.delete(`http://localhost:1337/api/questions/${id}`);
      router.push("/");
    }
  }

  return (
    <div className={styles.questionviewcontainer}>
      <div className={styles.questionviewmain}>
        <div style={{ width: "100%" }}>
          <div className={styles.questionviewname}>
            <h1>{question?.attributes.qText}</h1>
          </div>
          <div className={styles.questionviewminidet}>
            <div style={{ display: "flex" }}>
              <span>
                <button
                  onClick={() => setAnswerQuestionSection((pV) => !pV)}
                  className="btn-danger"
                  style={{
                    backgroundColor: "unset",
                    color: "black",
                    border: "unset",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "0",
                  }}
                >
                  <AnswerIcon />
                  <span style={{ paddingLeft: "6px" }}>Answer</span>
                </button>
              </span>
              <span>
                <button
                  onClick={deleteQuestion}
                  className="btn-danger"
                  style={{
                    backgroundColor: "unset",
                    color: "black",
                    border: "unset",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <DeleteIcon />
                  <span style={{ paddingLeft: "6px" }}>Delete</span>
                </button>
              </span>
            </div>
          </div>
          <div>
            {showAnswerQuestionSection ? (
              <AnswerQuestionSection question={question} />
            ) : null}
          </div>
          <div className={styles.questionviewtransactionscont}>
            <div className={styles.questionviewtransactions}>
              <h2>{answers?.length} Answers</h2>
            </div>
            <div
              className={styles.questionviewtransactionslist}
              style={{ padding: "unset" }}
            >
              {!answers || answers?.length <= 0
                ? "No Answers yet."
                : answers?.map((answer, i) => <Answer key={answer.id} answer={answer} comments={comments} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Answer({ answer, comments }) {
  const { id } = answer
  const { aText, user } = answer.attributes;

  console.log({ comments });

  const [_comments, setComments] = useState(comments ? comments.filter(comment => comment.attributes.answer.data?.id == id) : []);

  console.log(id, comments);

  const [showCommentInput, setShowCommentInput] = useState(false);
  const commentRef = useRef();
  const userRef = useRef();

  async function addComment() {
    const resultData = await axios.post("http://localhost:1337/api/comments", {
      data: {
        cText: commentRef.current.value,
        user: userRef.current.value,
        answer: id,
      }
    });
    setShowCommentInput(false);
    window.location.reload();

  }

  return (
    <div
      className={styles.question}
      style={{
        borderBottom: "1px solid rgba(234, 238, 243, 1)",
        padding: "14px",
      }}
    >
      <div className={styles.questiondetails}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "block",
              width: "35px",
              height: "35px",
              backgroundColor: "grey",
              borderRadius: "50%",
            }}
          ></span>
          <span style={{ paddingLeft: "4px" }}>{user}</span>
        </div>
        <div
          className={styles.questionbalance}
          style={{
            cursor: "pointer",
            paddingTop: "24px",
            paddingBottom: "24px",
          }}
        >
          <span>{aText}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "grey",
            cursor: "pointer",
          }}
          onClick={() => setShowCommentInput((pV) => !pV)}
        >
          <MsgIcon />
          <span style={{ paddingLeft: "6px" }}>{_comments?.length}</span>
        </div>
        <div>
          {showCommentInput ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: "9px",
              }}
            >
              <input
                type="text"
                placeholder="Enter user..."
                style={{
                  borderRadius: "9px",
                  width: "110px",
                  marginRight: "3px",
                }}
                ref={userRef}
              />
              <input
                type="text"
                placeholder="Add comment..."
                style={{ borderRadius: "9px" }}
                ref={commentRef}
              />
              <button
                style={{
                  borderRadius: "19px",
                  fontSize: "14px",
                  fontWeight: "bolder",
                  boxSizing: "content-box",
                }}
                onClick={addComment}
              >
                <div style={{ display: "flex", whiteSpace: "nowrap" }}>
                  Add Comment
                </div>
              </button>
            </div>
          ) : null}
        </div>
        <div
          style={{
            paddingTop: "14px",
            marginLeft: "23px",
            marginBottom: "14px",
          }}
        >
          {_comments?.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Comment({ comment }) {
  const { user, cText } = comment.attributes;
  return (
    <div
      className={styles.question}
      style={{
        backgroundColor: "rgba(234, 238, 243, 1)",
        padding: "14px",
        marginBottom: "4px",
      }}
    >
      <div className={styles.questiondetails}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "block",
              width: "35px",
              height: "35px",
              backgroundColor: "grey",
              borderRadius: "50%",
            }}
          ></span>
          <span style={{ paddingLeft: "4px" }}>{user}</span>
        </div>
        <div
          className={styles.questionbalance}
          style={{
            cursor: "pointer",
            paddingTop: "14px",
            paddingBottom: "14px",
          }}
        >
          <span>{cText}</span>
        </div>
      </div>
    </div>
  );
}

function AnswerQuestionSection({ question }) {
  var options = {
    placeholder: "Write your answer",
    readOnly: false,
    theme: "snow",
  };
  const editorRef = useRef();
  const userRef = useRef();
  const [disable, setDisable] = useState(false);
  const [q, setQuill] = useState();

  useEffect(() => {
    if (q) return;
    const _q = new Quill(editorRef.current, options);
    setQuill(_q);
  }, [q]);

  function answerQuestion() {
    setDisable(true);
    axios.post("http://localhost:1337/api/answers", {
      data: {
        aText: q.getText(),
        user: userRef.current.value,
        question: question?.id,
      }
    });
    setDisable(false);
    window.location.reload();
  }

  return (
    <div
      style={{
        marginTop: "16px",
        backgroundColor: "white",
      }}
    >
      <>
        <div>
          <input type="text" placeholder="Enter user here..." ref={userRef} />
        </div>
        <div
          name="editor"
          ref={editorRef}
          style={{ backgroundColor: "white" }}
        ></div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "14px",
          }}
        >
          <button
            style={{ borderRadius: "14px" }}
            onClick={answerQuestion}
            disabled={disable}
          >
            Post
          </button>
        </div>
      </>
    </div>
  );
}

function AnswerIcon() {
  return (
    <svg width="28px" height="28px" viewBox="0 0 24 24">
      <g
        id="answer"
        transform="translate(2.500000, 3.500000)"
        stroke="none"
        strokeWidth="1.5"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="pen"
          transform="translate(9.000000, 9.000000) rotate(-315.000000) translate(-9.000000, -9.000000) translate(7.000000, -1.000000)"
        >
          <path
            d="M2,8.8817842e-16 L2,8.8817842e-16 L2,8.8817842e-16 C3.1045695,6.85269983e-16 4,0.8954305 4,2 L4,16 L2.00256278,20 L0,16 L0,2 L0,2 C-1.35267774e-16,0.8954305 0.8954305,1.09108686e-15 2,8.8817842e-16 Z"
            id="pen_body"
            className="icon_svg-stroke"
            stroke="#666"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <polygon
            id="pen_tip"
            className="icon_svg-fill_as_stroke"
            fill="#666"
            transform="translate(2.000000, 18.750000) scale(1, -1) translate(-2.000000, -18.750000) "
            points="2 17.5 3.25 20 0.75 20"
          ></polygon>
        </g>
        <path
          d="M12,16 L17,16 L17,11 M7,1 L2,1 L2,6"
          id="bg"
          className="icon_svg-stroke"
          stroke="#666"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="28px" height="28px" viewBox="0 0 24 24">
      <g
        id="small_close"
        className="icon_svg-stroke"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        stroke="#666666"
        strokeWidth="1.5"
      >
        <path
          d="M12,6 L12,18"
          transform="translate(12.000000, 12.000000) rotate(45.000000) translate(-12.000000, -12.000000) "
        ></path>
        <path
          d="M18,12 L6,12"
          transform="translate(12.000000, 12.000000) rotate(45.000000) translate(-12.000000, -12.000000) "
        ></path>
      </g>
    </svg>
  );
}
