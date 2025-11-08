"use client";

import SideBar from "@/app/sidebar/sidebar";
import { TitleComponent } from "@/app/student/code/page";
import "./style.css";
import StudentsListComponent from "@/app/student/students-card/students-card-component";
import { useEffect, useState } from "react";
import { toaster } from "@/lib/toaster";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/lib/socketContext";

interface Student {
  _id: string;
  fullName: string;
  uniqueCode: string;
}

export default async function StudentsListDashboardComponent() {
  const params = useSearchParams();
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const { socket, isConnected } = useSocket();
  const sessionId = params.get("sessionId");
  const code = params.get("code");

  function arrangeStudentsName(): string[] {
    return studentsList.map((v) => {
      return v.fullName;
    });
  }

  async function handleStart() {
    await api.get(`/session/${sessionId}/session`);
    socket?.emit("startQuiz", { sessionId });
    console.log("event emitted");
  }

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

  useEffect(() => {
    if (!socket || !sessionId) return;

    socket.emit("joinSession", sessionId);

    socket.on("studentJoined", (studentData: Student | string) => {
      if (typeof studentData === "string") {
        const newStudent: Student = {
          _id: Date.now().toString(),
          fullName: studentData,
          uniqueCode: String(new Date().getTime()),
        };
        setStudentsList((prev) => {
          if (prev.some((student) => student.fullName === studentData)) {
            return prev;
          }
          return [...prev, newStudent];
        });
        toaster.success(`${studentData} joined the session`);
      } else {
        setStudentsList((prev) => {
          if (
            prev.some(
              (student) =>
                student._id === studentData._id ||
                student.fullName === studentData.fullName
            )
          ) {
            return prev;
          }
          return [...prev, studentData];
        });
        toaster.success(`${studentData.fullName} joined the session`);
      }
    });

    socket.on("studentLeft", (studentName: string) => {
      console.log("Student left:", studentName);
      setStudentsList((prev) =>
        prev.filter((student) => student.fullName !== studentName)
      );
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toaster.error("Connection lost. Trying to reconnect...");
    });

    return () => {
      console.log("Cleaning up socket listeners for session:", sessionId);
      socket.off("quizStarted");
      socket.off("studentJoined");
      socket.off("studentLeft");
      socket.off("connect_error");
      if (sessionId) {
        socket.emit("leaveSession", { sessionId });
      }
    };
  }, [socket, sessionId]);

  return (
    <main>
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          padding: "5px 10px",
          background: isConnected ? "green" : "red",
          color: "white",
          borderRadius: "4px",
          zIndex: 1000,
        }}
      >
        {isConnected ? "Connected" : "Disconnected"}
      </div>

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
            <button
              className="code_card_wrapper-button"
              onClick={() => handleStart()}
            >
              Boshlash
            </button>
          </div>
          <StudentsListComponent
            students={arrangeStudentsName()}
            style={{ width: "30%", maxHeight: "600px" }}
          />
        </div>
      </div>
    </main>
  );
}
