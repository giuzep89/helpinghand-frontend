import './Textarea.css';

function Textarea({ label, register, error, placeholder, rows = 4, value, onChange, maxLength }) {
  return (
    <div className="input-container">
      <label>
        <span>{label}</span>
        <textarea
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          {...register}
        />
      </label>
      {maxLength && value !== undefined && (
        <span className="textarea-counter">{value.length}/{maxLength}</span>
      )}
      {error && <p className="input-error">{error.message}</p>}
    </div>
  );
}

export default Textarea;
