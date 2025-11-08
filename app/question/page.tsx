"use client";
import { useRouter, useSearchParams } from "next/navigation";
import SideBar from "../sidebar/sidebar";
import { useState } from "react";
import "./question.css";
import { GoChevronDown } from "react-icons/go";
import { toaster } from "../../lib/toaster";
import api from "../../lib/api";

export default function CreateQuestionComponent() {
  const lettersArray = ["A", "B", "C", "D"];
  const searchParam = useSearchParams();
  const router = useRouter();
  const [questionProps, setQuestionProps] = useState({
    text: "",
    variants: { A: "", B: "" },
    correctAnswer: "",
    variantsArr: [],
  });

  const variantsArr = Object.keys(questionProps.variants);

  const quizType = searchParam.get("type");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionProps({ ...questionProps, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (variantKey: string, value: string) => {
    setQuestionProps({
      ...questionProps,
      variants: {
        ...questionProps.variants,
        [variantKey]: value,
      },
    });
  };

  const handleStartSession = async () => {
    const quizId = searchParam.get("quizId");
    try {
      const res = await api.post("/session/quiz", { quizId });
      console.log(res.data);
      if (res.data.success === true) {
        toaster.success("Quiz boshlandi!");
        router.push(
          `/students?sessionId=${res.data.sessionId}&code=${res.data.code}`
        );
      }
    } catch (error: any) {
      toaster.error(error.response?.data?.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const quizId = searchParam.get("quizId");
    e.preventDefault();
    try {
      const req = await api.post("/question", { ...questionProps, quizId });

      setQuestionProps({
        text: "",
        variants: { A: "", B: "" },
        correctAnswer: "",
        variantsArr: [],
      });

      toaster.success("Savol muvaffaqiyatli yaratildi!");
    } catch (e: any) {
      toaster.error(e.response?.data?.message);
    }
  };

  function addVariant() {
    if (variantsArr.length >= 4) {
      toaster.info("4 tadan ko'p variant qo'sha olmaysiz!");
      return;
    }

    const nextLetter = lettersArray[variantsArr.length];
    setQuestionProps({
      ...questionProps,
      variants: {
        ...questionProps.variants,
        [nextLetter]: "",
      },
    });
  }

  let quizTypeName: string;

  if (quizType === "individual") {
    quizTypeName = "Yakka";
  } else {
    quizTypeName = "Jamoaviy";
  }

  return (
    <>
      <div className="flex control-page">
        <SideBar />
        <div className="create_question_wrapper">
          <div className="create_question_wrapper-div">
            <h2 className="create_question_wrapper-h2">
              {quizTypeName} tartibli test yaratish
            </h2>
            <div className="question-form_wrapper">
              <form className="question-form" action="" onSubmit={handleSubmit}>
                <div>
                  <p className="question-form_wrapper-p">Savolni kiriting</p>
                  <input
                    className="question-input"
                    type="text"
                    name="text"
                    value={questionProps.text}
                    onChange={handleChange}
                    required
                  />
                </div>
                {variantsArr.map((key, i) => (
                  <div className="variant-input-wrapper" key={i}>
                    <div className="variant-input-container">
                      <div className="content-input-wrapper">
                        <input
                          className="variant_input_wrapper-input"
                          type="text"
                          value={questionProps.variantsArr[i]}
                          onChange={(e) =>
                            handleVariantChange(key, e.target.value)
                          }
                        />
                        <span className="variant_input_wrapper-span">
                          {key}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="add-question-form-button question-form-button"
                  type="button"
                  onClick={addVariant}
                >
                  Variant qo'shish +
                </button>
                <p className="question-form-p">To'g'ri javobni tanlang</p>
                <ul className="select-item">
                  <div className="select-item-wrapper">
                    <GoChevronDown
                      style={{
                        fontSize: "30px",
                        display: "flex",
                        alignItems: "center",
                        margin: "15px",
                      }}
                    />
                    <span className="selected-option">
                      {questionProps.correctAnswer.toUpperCase()}
                    </span>
                  </div>
                  {variantsArr.map((v, i) => (
                    <li
                      key={i}
                      onClick={() =>
                        setQuestionProps({ ...questionProps, correctAnswer: v })
                      }
                      className="select-time-option"
                    >
                      {v.toUpperCase()}
                    </li>
                  ))}
                </ul>
                <button className="question-form-button" type="submit">
                  Test qo'shish
                </button>
              </form>
            </div>
            <button onClick={handleStartSession} className="start-button">
              Oxirgi quizni boshlash
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
