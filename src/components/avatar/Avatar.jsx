import './Avatar.css';
import ProfilePicPlaceholder from '../../assets/Icons/ProfilePic-placeholder.svg';

function Avatar({ src, alt = "", size = "medium", className }) {
  if (!src) {
    return (
      <img
        src={ProfilePicPlaceholder}
        alt={alt}
        className={`avatar avatar-${size} avatar-placeholder ${className || ""}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`avatar avatar-${size} ${className || ""}`}
    />
  );
}

export default Avatar;
