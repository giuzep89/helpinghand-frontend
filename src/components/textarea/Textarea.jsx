import './Textarea.css';

function Textarea({ label, register, error, placeholder, rows = 4 }) {
  return (
    <div className="textarea-container">
      <label>
        <span>{label}</span>
        <textarea
          placeholder={placeholder}
          rows={rows}
          {...register}
        />
      </label>
      {error && <p className="textarea-error">{error.message}</p>}
    </div>
  );
}

export default Textarea;
