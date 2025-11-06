"use client";
import React, { useState } from "react";
import "./signup.css";
import Link from "next/link";
import api from "../api/signup/route";
import { toaster } from "../lib/toaster";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [userProps, setUserProps] = useState({
    firstName: "",
    lastName: "",
    password: "",
    phoneNumber: "",
    verificationPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProps({ ...userProps, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userProps.password !== userProps.verificationPassword) {
      setError("Parollar bir xil emas ❌");
      return;
    }

    setError("");
    try {
      const { verificationPassword, ...data } = userProps;
      const response = await api.post("/auth/teacher", data);
      toaster.success("Dasturga kiring!");
      router.push("/signin");
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
          <h2 className="form-h2">Ro'yhatdan o'tish</h2>
          <form action="" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Ismingiz"
              name="firstName"
              value={userProps.firstName}
              onChange={handleChange}
            />
            <input
              className="input"
              type="text"
              placeholder="Familyangiz"
              value={userProps.lastName}
              name="lastName"
              onChange={handleChange}
            />
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
              placeholder="Parol o'ylab toping"
              value={userProps.password}
              onChange={handleChange}
            />
            <input
              className="input"
              type="text"
              name="verificationPassword"
              placeholder="Parolni tasdinglang"
              value={userProps.verificationPassword}
              onChange={handleChange}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              disabled={
                !userProps.password ||
                !userProps.verificationPassword ||
                userProps.password !== userProps.verificationPassword
              }
              type="submit"
              className="form-btn"
            >
              Kirish
            </button>
          </form>
          <Link className="link-to-signin" href="/signin">
            Avval ro'yhatdan o'tganmisiz?
          </Link>
        </div>
      </div>
    </main>
  );
}
