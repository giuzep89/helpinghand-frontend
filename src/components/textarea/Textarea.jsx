import './Textarea.css';

function Textarea({ label, register, error, placeholder, rows = 4, value, onChange }) {
  return (
    <div className="input-container">
      <label>
        <span>{label}</span>
        <textarea
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={onChange}
          {...register}
        />
      </label>
      {error && <p className="input-error">{error.message}</p>}
    </div>
  );
}

export default Textarea;
