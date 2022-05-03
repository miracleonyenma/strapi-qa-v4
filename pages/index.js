import Head from "next/head";
import styles from "../styles/Home.module.css";
import QuestionCard from "../components/QuestionCard";
import { useEffect, useState } from "react";
import axios from "axios";

import AddQuestionDialog from "../components/AddQuestionDialog";


export const getServerSideProps = async () => {
  const { data } = await axios.get("http://localhost:1337/api/questions?populate=*");
  console.log(data);
  return {
    props: {
      the_questions: data.data
    }
  }
}

export default function Home({ the_questions }) {
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>Q/A App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <div>
            <span style={{ margin: "1px" }}>
              <button
                style={{
                  backgroundColor: "rgba(185, 43, 39, 1)",
                  border: "1px solid rgba(101, 20, 18, 1)",
                }}
                onClick={() => setShowAddQuestionModal(true)}
              >
                Add Question
              </button>
            </span>
          </div>
        </div>

        <div className={styles.questioncontainerr}>
          <div>
            {the_questions?.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        </div>
        {showAddQuestionModal ? (
          <AddQuestionDialog
            closeModal={() => setShowAddQuestionModal((pV) => !pV)}
          />
        ) : null}
      </main>
    </div>
  );
}
