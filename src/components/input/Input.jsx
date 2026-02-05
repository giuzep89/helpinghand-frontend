import './Input.css';

function Input({ label, type = "text", id, register, error }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} {...register} />
      {error && <p>{error.message}</p>}
    </div>
  );
}

export default Input;
