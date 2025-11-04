"use client";
import React, { useState } from "react";
import "./signin.css";
import "../signup/signup.css";
import Link from "next/link";
import api from "../api/signup/route";
import toaster from "../lib/toaster";

export default function SignIn() {
  const [userProps, setUserProps] = useState({
    password: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProps({ ...userProps, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.put("/auth/teacher", userProps);
      toaster.success("Siz tasdiqlandingiz!");
      localStorage.setItem("token", response.data.token);
    } catch (e: any) {
      toaster.error(
        "Ro'yhatdan o'tishda hatolik yuz berdi! " + e.response?.data?.message
      );
    }
  };

  return (
    <main className="signup_wrapper">
      <div className="divs_wrapper">
        <div className="title">
          <h1 className="title-h1">Odatdagidan osonroq va unumliroq</h1>
        </div>
        <div className="form">
          <h2 className="form-h2">Kirish</h2>
          <form action="" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Telefon raqamingiz"
              name="phoneNumber"
              value={userProps.phoneNumber}
              onChange={handleChange}
            />
            <input
              className="input"
              type="text"
              name="password"
              placeholder="Parolingiz"
              value={userProps.password}
              onChange={handleChange}
            />
            <button type="submit" className="form-btn">
              Kirish
            </button>
          </form>
          <Link className="link-to-signin" href="/signup">
            Ro'yhatdan o'tish
          </Link>
        </div>
      </div>
    </main>
  );
}
