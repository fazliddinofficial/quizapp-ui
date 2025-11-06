import { TitleComponent } from "../code/page";
import StudentsListComponent from "../students-card/students-card-component";
import "./index.css";

export default function StudentsComponent() {
  return (
    <main className="students_list_card">
      <TitleComponent
        style={{ width: "60%" }}
        text="Boshlanishiga oz qoldi"
        key={new Date().getTime()}
      />
      <div>
        <StudentsListComponent students={["zamira", "eshmat", "toshmat"]} />
      </div>
      <TitleComponent style={{ width: "30%" }} text="Biroz kuting" />
    </main>
  );
}
