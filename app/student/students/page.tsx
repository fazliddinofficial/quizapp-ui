"use client";
import { useSearchParams } from "next/navigation";
import { TitleComponent } from "../code/page";
import StudentsListComponent from "../students-card/students-card-component";
import "./index.css";
import { toaster } from "@/app/lib/toaster";
import { useEffect, useState, useCallback } from "react";
import api from "@/app/api/route";
import { useSocket } from "@/app/lib/socketContext";
import { useRouter } from "next/navigation";

export default function StudentsComponent() {
  const searchParam = useSearchParams();
  const [studentsArray, setStudentsArray] = useState<string[]>([]);
  const { socket, isConnected } = useSocket();
  const router = useRouter();

  const sessionId = searchParam.get("sessionId");

  const fetchData = async () => {
    if (!sessionId) {
      toaster.error("Quiz topilmadi");
      return;
    }

    try {
      const response = await api.get(`/session/${sessionId}/students`);
      setStudentsArray(response.data || []);
    } catch (error: any) {
      toaster.error(error.response?.data?.message || "Serverda nosozlik!");
    }
  };

  const handleQuizStarted = useCallback(
    (data: any) => {
      console.log("🎯 Quiz started received:", data);
      toaster.success("Quiz boshlandi!");
      router.push(`/question/start?sessionId=${data.sessionId}`);
    },
    [router]
  );

  const handleStudentJoined = useCallback((studentName: string) => {
    setStudentsArray((prev) =>
      prev.includes(studentName) ? prev : [...prev, studentName]
    );
    toaster.success(`${studentName} sessiyaga qo'shildi`);
  }, []);

  const handleStudentLeft = useCallback((studentName: string) => {
    setStudentsArray((prev) => prev.filter((name) => name !== studentName));
  }, []);

  useEffect(() => {
    if (!socket || !sessionId || !isConnected) return;

    fetchData();

    socket.emit("joinSession", { sessionId });

    socket.on("quizStarted", handleQuizStarted);
    socket.on("studentJoined", handleStudentJoined);
    socket.on("studentLeft", handleStudentLeft);

    return () => {
      socket.off("quizStarted", handleQuizStarted);
      socket.off("studentJoined", handleStudentJoined);
      socket.off("studentLeft", handleStudentLeft);
      socket.emit("leaveSession", { sessionId });
    };
  }, [
    socket,
    sessionId,
    isConnected,
    handleQuizStarted,
    handleStudentJoined,
    handleStudentLeft,
  ]);

  return (
    <main className="students_list_card">
      <TitleComponent style={{ width: "60%" }} text="Boshlanishiga oz qoldi" />

      <div
        className="connection-status"
        style={{
          padding: "8px 16px",
          borderRadius: "16px",
          marginBottom: "16px",
          color: "#111111",
          textAlign: "center",
          border: "2px solid #111111",
          background: isConnected ? "#d4edda" : "#f8d7da",
          fontWeight: "bold",
        }}
      >
        📶 Holat: {isConnected ? "Ulangan" : "Ulanmagan"} | 👥 O'quvchilar soni:{" "}
        {studentsArray.length}
        {!isConnected && (
          <div
            style={{ fontSize: "12px", marginTop: "4px", fontWeight: "normal" }}
          >
            Serverga ulanmoqda...
          </div>
        )}
      </div>

      <div>
        <StudentsListComponent students={studentsArray} />
      </div>

      <TitleComponent
        style={{ width: "30%", marginTop: "20px" }}
        text="Biroz kuting"
      />
    </main>
  );
}
