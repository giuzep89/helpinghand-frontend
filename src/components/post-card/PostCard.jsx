import { useState } from 'react';
import './PostCard.css';
import Button from '../button/Button.jsx';
import Avatar from '../avatar/Avatar.jsx';
import { toDisplayDate } from '../../helpers/formatDateTime.js';
import { getProfilePictureUrl } from '../../helpers/api.js';

import GardeningIcon from '../../assets/Icons/help requests label icons/gardening.svg';
import TaxesIcon from '../../assets/Icons/help requests label icons/taxes.svg';
import CompanyIcon from '../../assets/Icons/help requests label icons/company.svg';
import PlumbingIcon from '../../assets/Icons/help requests label icons/plumbing.svg';
import PaintingIcon from '../../assets/Icons/help requests label icons/painting.svg';
import MovingIcon from '../../assets/Icons/help requests label icons/moving.svg';
import ITIcon from '../../assets/Icons/help requests label icons/IT.svg';
import BureaucracyIcon from '../../assets/Icons/help requests label icons/bureaucracy.svg';
import LanguageIcon from '../../assets/Icons/help requests label icons/language.svg';
import GroceriesIcon from '../../assets/Icons/help requests label icons/groceries.svg';
import PetsittingIcon from '../../assets/Icons/help requests label icons/petsitting.svg';
import TransportIcon from '../../assets/Icons/help requests label icons/transport.svg';
import RepairsIcon from '../../assets/Icons/help requests label icons/repairs.svg';
import ChoresIcon from '../../assets/Icons/help requests label icons/chores.svg';

const helpTypeIcons = {
  GARDENING: GardeningIcon,
  TAXES: TaxesIcon,
  COMPANY: CompanyIcon,
  PLUMBING: PlumbingIcon,
  PAINTING: PaintingIcon,
  MOVING: MovingIcon,
  IT: ITIcon,
  BUREAUCRACY: BureaucracyIcon,
  LANGUAGE: LanguageIcon,
  GROCERIES: GroceriesIcon,
  PETSITTING: PetsittingIcon,
  TRANSPORT: TransportIcon,
  REPAIRS: RepairsIcon,
  HOUSE_CHORES: ChoresIcon
};

function PostCard({ post, currentUsername, friends = [], onContact, onDelete, onHelpFound }) {
  const [showPrizeList, setShowPrizeList] = useState(false);
  const [selectedHelpers, setSelectedHelpers] = useState([]);

  const isAuthor = post.authorUsername === currentUsername;
  const isHelpRequest = post.postType === 'HELP_REQUEST';
  const canMarkHelpFound = isAuthor && isHelpRequest && !post.helpFound;

  const authorPicture = getProfilePictureUrl(post.authorUsername);

  function handleHelperToggle(friendId) {
    setSelectedHelpers((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  }

  function handleAwardPrize() {
    onHelpFound(post.id, selectedHelpers);
    setShowPrizeList(false);
    setSelectedHelpers([]);
  }

  function handleCancelPrize() {
    setShowPrizeList(false);
    setSelectedHelpers([]);
  }

  return (
    <article className="post-card">
      {isHelpRequest && post.helpType && (
        <div className={`help-type-label ${post.helpType.toLowerCase()}`}>
          <img src={helpTypeIcons[post.helpType]} alt="" />
        </div>
      )}

      {isHelpRequest && post.helpFound && (
        <div className="post-card-badge">Help found!</div>
      )}

      <div className="post-card-header">
        <Avatar src={authorPicture} size="medium" />
        <span className="post-card-username">{post.authorUsername}</span>
      </div>

      <h3 className="post-card-title">{post.displayTitle}</h3>
      <p className="post-card-description">{post.description}</p>
      {post.location && <p className="post-card-location">Location: {post.location}</p>}
      {!isHelpRequest && post.eventDate && (
        <p className="post-card-event-date">Date: {toDisplayDate(post.eventDate)}</p>
      )}

      <div className="post-card-actions">
        {!isAuthor && (
          <Button onClick={() => onContact(post)}>Contact</Button>
        )}
        {canMarkHelpFound && !showPrizeList && (
          <Button onClick={() => setShowPrizeList(true)}>Help Found</Button>
        )}
        {isAuthor && (
          <Button variant="delete" onClick={() => onDelete(post.id)}>Delete</Button>
        )}
      </div>

      {canMarkHelpFound && showPrizeList && (
        <div className="prize-list">
          <p className="prize-list-title">Who helped you?</p>
          {friends.length === 0 ? (
            <p className="prize-list-empty">No friends to award prizes to.</p>
          ) : (
            <div className="prize-list-options">
              {friends.map((friend) => (
                <label key={friend.id} className="prize-list-option">
                  <input
                    type="checkbox"
                    checked={selectedHelpers.includes(friend.id)}
                    onChange={() => handleHelperToggle(friend.id)}
                  />
                  <span>{friend.username}</span>
                </label>
              ))}
            </div>
          )}
          <div className="prize-list-actions">
            <Button onClick={handleAwardPrize}>Award Prize</Button>
            <Button variant="delete" onClick={handleCancelPrize}>Cancel</Button>
          </div>
        </div>
      )}
    </article>
  );
}

export default PostCard;
