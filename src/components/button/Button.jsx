import './Button.css';

function Button({ children, type = "button", variant = "primary", onClick, disabled }) {
  return (
    <button
      type={type}
      className={`button button-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
