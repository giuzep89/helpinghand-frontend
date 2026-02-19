import { useState } from 'react';
import './Avatar.css';
import ProfilePicPlaceholder from '../../assets/Icons/ProfilePic-placeholder.svg';

function Avatar({ src, alt = "", size = "medium", className }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
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
      onError={() => setHasError(true)}
    />
  );
}

export default Avatar;
