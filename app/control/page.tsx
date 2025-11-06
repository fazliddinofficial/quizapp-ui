"use client";
import React, { useState } from "react";
import SideBar from "../sidebar/sidebar";
import "./control.css";
import { toaster } from "../lib/toaster";
import api from "../api/signup/route";
import { useRouter } from "next/navigation";

export default function ControlPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState({ title: "", quizType: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/quiz", quiz);
      toaster.success("Quiz yaratildi!");
      router.push(
        `/question?quizId=${response.data._id}&type=${response.data.quizType}`
      );
    } catch (error: any) {
      toaster.error(
        "Quiz yaratishda hatolik! " + error.response?.data?.message
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="flex control-page">
        <SideBar />
        <div className="create-test-wrapper">
          <h2 className="create-test-wrapper-h2">
            Qanday test yaratmoqchisiz?
          </h2>
          <div className="button-wrapper">
            <button
              className="button-wrapper-btn"
              onClick={() => setQuiz({ ...quiz, quizType: "individual" })}
            >
              Yakka
            </button>
            <button
              className="button-wrapper-btn"
              onClick={() => setQuiz({ ...quiz, quizType: "group" })}
            >
              Jamoaviy
            </button>
          </div>
          <div className="create-test-form">
            <form action="" onSubmit={handleSubmit}>
              <input
                className="create-test-form-input"
                type="text"
                placeholder="Quiz uchun nom kiriting"
                name="title"
                value={quiz.title}
                onChange={handleChange}
              />
              <button className="form-btn" type="submit">
                Quiz yaratish
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
