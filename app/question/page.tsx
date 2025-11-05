"use client";
import { useSearchParams } from "next/navigation";
import SideBar from "../sidebar/sidebar";
import { useState } from "react";
import "./question.css";
import { VariantInput } from "./CInput";
import { GoChevronDown } from "react-icons/go";
import { toaster } from "../lib/toaster";

export default function CreateQuestionComponent() {
  const lettersArray = ["A", "B", "C", "D"];
  const searchParam = useSearchParams();
  const [questionProps, setQuestionProps] = useState({
    text: "",
    variants: { A: "", B: "" },
    correctAnswer: "",
  });

  const variantsArr = Object.keys(questionProps.variants);

  const quizId = searchParam.get("quizId");
  const quizType = searchParam.get("type");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionProps({ ...questionProps, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
    } catch (e: any) {
      toaster.error(e.response?.data?.message);
    }
  };

  function addVariant() {
    if (+variantsArr.length >= 4) {
      toaster.info("4 tadan ko'p variant qo'sha olmaysiz!");
      return;
    }
    variantsArr.push(lettersArray[variantsArr.length]);
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
                  />
                </div>
                {variantsArr.map((key, i) => (
                  <VariantInput letter={key} key={i} />
                ))}
                <button
                  className="add-question-form-button question-form-button"
                  type="button"
                  onClick={() => addVariant()}
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
                  Keyingi Bosqich
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
