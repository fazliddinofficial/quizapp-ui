"use client";

import React, { FormEvent, useState } from "react";
import { TitleComponent } from "../code/page";
import { useSearchParams } from "next/navigation";
import api from "@/app/api/route";
import { toaster } from "@/app/lib/toaster";
import { useRouter } from "next/navigation";

export default function NameComponent() {
  const uniqueCode = new Date().getTime();

  const router = useRouter();

  const [name, setName] = useState("");

  const searchParam = useSearchParams();

  let sessionCode = searchParam.get("code");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const request = await api.post("/session/join", {
        userName: name,
        code: sessionCode,
        uniqueCode,
      });

      localStorage.setItem("userId", String(uniqueCode));

      router.push(`/student/students?sessionId=${request.data.foundSession}`);

      toaster.success("Siz quizga qo'shildingiz!");
    } catch (error: any) {
      toaster.error(error.response?.data?.message);
      router.push(`/`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <main className="code_page_main">
      <div className="code_page_wrapper">
        <TitleComponent text="Ismingizni kiriting" />
        <form
          action=""
          onSubmit={handleSubmit}
          className="code_page_wrapper-form"
        >
          <input
            className="code_page_wrapper-input"
            type="text"
            name="code"
            onChange={handleChange}
          />
          <button className="code_page_wrapper-button" type="submit">
            Davom etish
          </button>
        </form>
      </div>
    </main>
  );
}
