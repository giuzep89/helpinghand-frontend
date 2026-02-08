import './Input.css';

function Input({ label, type = "text", register, error }) {
  return (
    <div className="input-container">
      <label>
        <span>{label}</span>
        <input type={type} {...register} />
      </label>
      {error && <p className="input-error">{error.message}</p>}
    </div>
  );
}

export default Input;
