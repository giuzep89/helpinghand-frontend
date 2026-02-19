import './PostCard.css';
import Button from '../button/Button.jsx';
import Avatar from '../avatar/Avatar.jsx';
import { toDisplayDate } from '../../helpers/formatDateTime.js';

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

function PostCard({ post, currentUsername, onContact, onDelete, onHelpFound }) {
  const isAuthor = post.authorUsername === currentUsername;
  const isHelpRequest = post.postType === 'HELP_REQUEST';

  // TODO replace with real profile picture URL from API
  const authorPicture = `https://i.pravatar.cc/150?u=${post.authorUsername}`;

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
        {isAuthor && isHelpRequest && !post.helpFound && (
          <Button onClick={() => onHelpFound(post.id)}>Help Found</Button>
        )}
        {isAuthor && (
          <Button variant="delete" onClick={() => onDelete(post.id)}>Delete</Button>
        )}
      </div>
    </article>
  );
}

export default PostCard;
