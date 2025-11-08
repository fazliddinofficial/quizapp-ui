"use client";
import { useSearchParams } from "next/navigation";
import { TitleComponent } from "../code/page";
import StudentsListComponent from "../students-card/students-card-component";
import "./index.css";
import { toaster } from "@/app/lib/toaster";
import { useEffect, useState } from "react";
import api from "@/app/api/route";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function StudentsComponent() {
  const searchParam = useSearchParams();
  const [studentsArray, setStudentsArray] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
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

  useEffect(() => {
    fetchData();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const socketInstance = io(process.env.BACK_END_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error);
      toaster.error("Serverga ulanib boʻlmadi");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [sessionId]);

  useEffect(() => {
    if (!socket || !sessionId) return;

    // Join the session room
    socket.emit("joinSession", sessionId);

    // Listen for new student joined events
    socket.on("studentJoined", (studentName: string) => {
      console.log("New student joined:", studentName);
      setStudentsArray((prev) => {
        if (prev.includes(studentName)) {
          return prev;
        }
        return [...prev, studentName];
      });
      toaster.success(`${studentName} sessiyaga qo'shildi`);
    });

    // Listen for student left events
    socket.on("studentLeft", (studentName: string) => {
      console.log("Student left:", studentName);
      setStudentsArray((prev) => prev.filter((name) => name !== studentName));
    });

    // Cleanup listeners
    return () => {
      socket.off("studentJoined");
      socket.off("studentLeft");
      socket.emit("leaveSession", sessionId);
    };
  }, [socket, sessionId]);
  useEffect(() => {
    if (!socket) return;
    socket.on("quizStarted", (data) => {
      toaster.success(data.message);
      router.push(`/question/start?sessionId=${data.sessionId}`);
    });

    return () => {
      socket.off("quizStarted");
    };
  }, [socket]);

  return (
    <main className="students_list_card">
      <TitleComponent style={{ width: "60%" }} text="Boshlanishiga oz qoldi" />

      <div
        className="connection-status"
        style={{
          padding: "8px",
          borderRadius: "16px",
          marginBottom: "16px",
          color: "#111111",
          textAlign: "center",
          border: "2px solid #111111",
        }}
      >
        Holat: {isConnected ? "Ulangan" : "Ulanmagan"} | O'quvchilar soni:{" "}
        {studentsArray.length}
      </div>

      <div>
        <StudentsListComponent students={studentsArray} />
      </div>
      <TitleComponent style={{ width: "30%" }} text="Biroz kuting" />
    </main>
  );
}
