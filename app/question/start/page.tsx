"use client";
import { TitleComponent } from "@/app/student/code/page";
import "./style.css";
import { toaster } from "@/lib/toaster";
import { useEffect, useState } from "react";
import api from "@/api/route";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";

export default function questionTest() {
  const params = useSearchParams();
  const sessionId = params.get("sessionId");

  const [question, setQuestion] = useState("");
  const [variants, setVariants] = useState([""]);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  async function fetchQuestion() {
    const req = await api.get(`session/${sessionId}/start`);
    setQuestion(req.data.text);
    setVariants(Object.values(req.data.variants));
    console.log(req.data);
    setQuestionIndex(req.data.questionIndex);
  }

  useEffect(() => {
    fetchQuestion();
  }, []);

  function markAnswer() {
    const selectedAnswer = variants[answerIndex];
    toaster.info(`Siz "${selectedAnswer}" javobini tanladingiz`);
    //keyingi function chaqirilida keyingi savol fetch qilish uchun
  }

  const questionText = `${questionIndex}. ${question}`;

  return (
    <main className="main_wrapper">
      <TitleComponent text="To'g'ri javobni tanlang" style={{ width: "50%" }} />
      <div className="question_name_wrapper">
        <TitleComponent text={questionText} />
      </div>
      <div className="variants_wrapper">
        {variants.map((variant, i) => (
          <button
            onClick={() => {
              setAnswerIndex(i + 1);
            }}
            className="variants_wrapper-button"
            key={i}
          >
            {variant}
          </button>
        ))}
      </div>
      <button onClick={markAnswer} className="answer-button">
        Belgilash
      </button>
    </main>
  );
}
