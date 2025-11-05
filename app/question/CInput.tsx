import "./question.css";

type VariantInputType = {
  letter: string;
};
export function VariantInput({ letter }: VariantInputType) {
  return (
    <>
      <div className="variant_input_wrapper">
        <input type="text" className="variant_input_wrapper-input" />
        <span className="variant_input_wrapper-span">
          {letter.toUpperCase()}
        </span>
      </div>
    </>
  );
}
