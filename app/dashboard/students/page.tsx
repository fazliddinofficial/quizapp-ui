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
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

interface Student {
  _id: string;
  fullName: string;
  uniqueCode: string;
}

export default function StudentsListDashboardComponent() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("sessionId");
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const { socket, isConnected } = useSocket();

  function arrangeStudentsName(): string[] {
    return studentsList.map((v) => {
      return v.fullName;
    });
  }

  async function handleStart() {
    await api.get(`/session/${sessionId}/session`);
    socket?.emit("startQuiz", { sessionId });
  }

  const code = params.get("code");

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
    const socket = io(process.env.BACK_END_URL || "http://localhost:7000");

    socket.on("quiz_started", (data) => {
      return () => {
        socket.disconnect();
      };
    });
  }, []);

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

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("studentJoined");
      socket.off("studentLeft");
      socket.off("connect_error");
      socket.emit("leaveSession", sessionId);
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
              onClick={() => {
                handleStart();
              }}
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
