import "./style.css";

type ListPropType = {
  students: string[];
  style?: React.CSSProperties;
};

export default function StudentsListComponent({
  students,
  style,
}: ListPropType) {
  return (
    <div className="wrapper_list" style={style}>
      <h1 className="wrapper_list-h1">O'quvchilar {students.length}/20</h1>
      <ol type="1">
        {students.map((name, i) => (
          <li className="wrapper_list-li" key={i}>
            <span className="wrapper_list-span">{i + 1}.</span>
            {name}
          </li>
        ))}
      </ol>
    </div>
  );
}
