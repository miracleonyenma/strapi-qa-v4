import styles from "./QuestionCard.module.css";
import Link from "next/link";

export default function QuestionCard({ question }) {
  const { id, qText, user, answers } = question;

  return (
    <div className={styles.question}>
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
        <Link href={`questions/${id}`}>
          <div className={styles.questionbalance} style={{ cursor: "pointer" }}>
            <h3>{qText}</h3>
          </div>
        </Link>
        <div
          style={{ display: "flex", alignItems: "center", color: "grey" }}
          title="Answers"
        >
          <MsgIcon />
          <span style={{ paddingLeft: "6px" }}>{answers.length}</span>
        </div>
      </div>
    </div>
  );
}

export function MsgIcon() {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24">
      <g
        id="comment"
        className="icon_svg-stroke icon_svg-fill"
        stroke="#666"
        strokeWidth="1.5"
        fill="none"
        fillRule="evenodd"
      >
        <path d="M12.0711496,18.8605911 C16.1739904,18.8605911 19.5,15.7577921 19.5,11.9302955 C19.5,8.102799 16.1739904,5 12.0711496,5 C7.96830883,5 4.64229922,8.102799 4.64229922,11.9302955 C4.64229922,13.221057 5.02055525,14.429401 5.67929998,15.4641215 C5.99817082,15.9649865 4.1279592,18.5219189 4.56718515,18.9310749 C5.02745574,19.3598348 7.80252458,17.6358115 8.37002246,17.9406001 C9.45969688,18.5258363 10.7235179,18.8605911 12.0711496,18.8605911 Z"></path>
      </g>
    </svg>
  );
}
