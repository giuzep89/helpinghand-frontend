import './Avatar.css';
import ProfilePicPlaceholder from '../../assets/Icons/ProfilePic-placeholder.svg';

function Avatar({ src, alt = "", size = "medium", className }) {
  return (
    <img
      src={src || ProfilePicPlaceholder}
      alt={alt}
      className={`avatar avatar-${size} ${className || ""}`}
    />
  );
}

export default Avatar;
