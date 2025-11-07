"use client";
import { useSearchParams } from "next/navigation";
import { TitleComponent } from "../code/page";
import StudentsListComponent from "../students-card/students-card-component";
import "./index.css";
import { toaster } from "@/app/lib/toaster";
import { useEffect, useState } from "react";
import api from "@/app/api/route";
import { io, Socket } from "socket.io-client";

export default function StudentsComponent() {
  const searchParam = useSearchParams();
  const [studentsArray, setStudentsArray] = useState([""]);
  const [socket, setSocket] = useState<Socket | null>(null);

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
  }, []);

  return (
    <main className="students_list_card">
      <TitleComponent style={{ width: "60%" }} text="Boshlanishiga oz qoldi" />
      <div>
        <StudentsListComponent students={studentsArray} />
      </div>
      <TitleComponent style={{ width: "30%" }} text="Biroz kuting" />
    </main>
  );
}
