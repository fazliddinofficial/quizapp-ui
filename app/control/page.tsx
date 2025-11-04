import SideBar from "../sidebar/sidebar";
import "./control.css";

export default function ControlPage() {
  return (
    <>
      <div className="flex control-page">
        <SideBar />
        <div className="create-test-wrapper">
          <h2 className="create-test-wrapper-h2">
            Qanday test yaratmoqchisiz?
          </h2>
          <div className="button-wrapper">
            <button className="button-wrapper-btn">Yakka</button>
            <button className="button-wrapper-btn">Jamoaviy</button>
          </div>
        </div>
      </div>
    </>
  );
}
