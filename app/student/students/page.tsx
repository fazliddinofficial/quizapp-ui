"use client";
import { useSearchParams } from "next/navigation";
import { TitleComponent } from "../code/page";
import StudentsListComponent from "../students-card/students-card-component";
import "./index.css";
import { toaster } from "@/app/lib/toaster";
import { useCallback, useEffect, useState } from "react";
import api from "@/app/api/signup/route";
import { io, Socket } from "socket.io-client";

export default function StudentsComponent() {
  const searchParam = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<{ fullName: string; _id: string }[]>(
    []
  );
  const [socket, setSocket] = useState<Socket | null>(null);

  const sessionId = searchParam.get("sessionId");

  const arrangeNames = useCallback((): string[] => {
    return rawData.map((obj) => obj.fullName).filter((name) => name);
  }, [rawData]);

  const fetchData = useCallback(async () => {
    if (!sessionId) {
      setLoading(false);
      toaster.error("Session ID not found");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/session/${sessionId}`);
      setRawData(response.data.students || []);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toaster.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch students"
      );
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!sessionId) return;

    // Initialize socket connection
    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
      {
        query: {
          sessionId: sessionId,
        },
      }
    );

    setSocket(newSocket);

    // Listen for student updates
    newSocket.on("studentsUpdated", (updatedStudents) => {
      setRawData(updatedStudents);
      toaster.success("Students list updated!");
    });

    // Listen for new student joined
    newSocket.on("studentJoined", (newStudent) => {
      setRawData((prev) => [...prev, newStudent]);
      toaster.success(`${newStudent.fullName} joined the session!`);
    });

    // Listen for student left
    newSocket.on("studentLeft", (_id) => {
      setRawData((prev) => prev.filter((student) => student._id !== _id));
      toaster.info("A student left the session");
    });

    // Handle connection errors
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toaster.error("Real-time connection failed");
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [sessionId]);

  return (
    <main className="students_list_card">
      <TitleComponent style={{ width: "60%" }} text="Boshlanishiga oz qoldi" />
      <div>
        <StudentsListComponent students={arrangeNames()} />
      </div>
      <TitleComponent style={{ width: "30%" }} text="Biroz kuting" />
    </main>
  );
}
