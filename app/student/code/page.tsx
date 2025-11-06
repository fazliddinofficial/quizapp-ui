"use client";

import React, { FormEvent, useState } from "react";
import "./codePage.css";
import { useRouter } from "next/navigation";

export function TitleComponent(props: {
  text: string;
  style?: React.CSSProperties;
}) {
  return (
    <h1 className="code_page_wrapper-h1" style={props.style}>
      {props.text}
    </h1>
  );
}

export default function CodePage() {
  const route = useRouter();
  const [code, setCode] = useState(0);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  const handleChange = () => {
    route.push(`/student/name?code=${code}`);
  };

  return (
    <main className="code_page_main">
      <div className="code_page_wrapper">
        {<TitleComponent text="Kirish uchun kodni kiriting" />}
        <form
          className="code_page_wrapper-form"
          action=""
          onSubmit={handleSubmit}
        >
          <input
            className="code_page_wrapper-input"
            type="number"
            onChange={(e) => {
              setCode(+e.target.value);
            }}
            name="code"
          />
          <button
            onClick={handleChange}
            className="code_page_wrapper-button"
            type="submit"
          >
            Kirish
          </button>
        </form>
      </div>
    </main>
  );
}
