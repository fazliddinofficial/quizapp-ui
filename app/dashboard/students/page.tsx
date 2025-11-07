"use client";
import SideBar from "@/app/sidebar/sidebar";
import { TitleComponent } from "@/app/student/code/page";
import "./style.css";
import StudentsListComponent from "@/app/student/students-card/students-card-component";
import { useEffect, useState } from "react";
import { toaster } from "@/app/lib/toaster";
import api from "@/app/api/route";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/app/lib/socketContext";

interface Student {
  _id: string;
  fullName: string;
  uniqueCode: string;
}

export default function StudentsListDashboardComponent() {
  const params = useSearchParams();
  const [studentsList, setStudentsList] = useState<string[]>([]);
  const { socket, isConnected } = useSocket();

  const code = params.get("code");
  const sessionId = params.get("sessionId");

  async function fetchStudents() {
    try {
      const req = await api.get(`/session/${sessionId}/students`);
      setStudentsList(req.data || []);
    } catch (error: any) {
      toaster.error(error.response?.data?.message);
      setStudentsList([]);
    }
  }

  useEffect(() => {
    if (sessionId) {
      fetchStudents();
    }
  }, [sessionId]);

  // useEffect(() => {
  //   if (sessionId) {
  //     fetchStudents();
  //   }
  // }, [sessionId]);

  // useEffect(() => {
  //   if (sessionId) {
  //     fetchStudents();
  //   }
  // }, [sessionId]);

  useEffect(() => {
    if (!socket || !sessionId) return;

    // Join the session room
    socket.emit("joinSession", sessionId);

    // Listen for new student joined events - now expecting just the student name (string)
    socket.on("studentJoined", (studentName: string) => {
      setStudentsList((prev) => {
        // Avoid duplicates - make sure we always return an array of strings
        if (prev.includes(studentName)) {
          return prev;
        }
        return [...prev, studentName];
      });
      toaster.success(`${studentName} joined the session`);
    });

    // Listen for student left events if needed
    socket.on("studentLeft", (studentName: string) => {
      setStudentsList((prev) => prev.filter((name) => name !== studentName));
    });

    // Cleanup listeners
    return () => {
      socket.off("studentJoined");
      socket.off("studentLeft");
      socket.emit("leaveSession", sessionId);
    };
  }, [socket, sessionId]);

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
