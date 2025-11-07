"use client";
import SideBar from "@/app/sidebar/sidebar";
import { TitleComponent } from "@/app/student/code/page";
import "./style.css";
import StudentsListComponent from "@/app/student/students-card/students-card-component";
import { useEffect, useState } from "react";
import { toaster } from "@/app/lib/toaster";
import api from "@/app/api/route";
import { useRouter, useSearchParams } from "next/navigation";

export default function StudentsListDashboardComponent() {
  const params = useSearchParams();
  const [studentsList, setStudentsList] = useState([""]);

  const code = params.get("code");
  const sessionId = params.get("sessionId");

  async function fetchStudents() {
    try {
      const req = await api.get(`/session/${sessionId}/students`);
      console.log(req.data);
    } catch (error: any) {
      toaster.error(error.response?.data?.message);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <main>
      <div className="sidebar_wrapper">
        <SideBar />
      </div>
      <div className="contentWrapper">
        <TitleComponent style={{ width: "60%" }} text="Kirish uchun kod" />
        <div className="cards_wrapper">
          <div className="code_card_wrapper">
            <h2 className="code_card_wrapper-h2">Kirish uchun kod</h2>
            <TitleComponent
              style={{ width: "300px", minHeight: "200px" }}
              text={String(code)}
            />
            <button className="code_card_wrapper-button">Boshlash</button>
          </div>
          <StudentsListComponent
            students={studentsList}
            style={{ width: "30%", maxHeight: "600px" }}
          />
        </div>
      </div>
    </main>
  );
}
