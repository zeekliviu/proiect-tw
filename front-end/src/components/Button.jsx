import "../styles/Button.css";

export default function Button(props) {
  return (
    <>
      <button
        onClick={props.onClick}
        style={props.style}
        className={props.className}
        type={props.type}
      >
        {props.children}
      </button>
    </>
  );
}
