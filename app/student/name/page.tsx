"use client";

import React, { FormEvent, useState } from "react";
import { TitleComponent } from "../code/page";
import { useSearchParams } from "next/navigation";

export default function NameComponent() {
  const [name, setName] = useState("");
  const searchParam = useSearchParams();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    //api call
  };
  const sessionCode = searchParam.get("code");
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
