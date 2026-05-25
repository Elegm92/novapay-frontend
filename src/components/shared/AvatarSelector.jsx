import styles from "./AvatarSelector.module.css";
import { useAuth } from "../../hooks/useAuth.js";
import { getAvatarUrl } from "../../utils/avatar.js";

const AVATAR_STYLES = [
  { value: "bottts", label: "Robot" },
  { value: "adventurer", label: "Adventurer" },
  { value: "avataaars", label: "Avatar" },
  { value: "personas", label: "Persona" },
  { value: "notionists", label: "Notion" },
  { value: "open-peeps", label: "Peeps" },
  { value: "pixel-art", label: "Pixel" },
  { value: "shapes", label: "Shapes" },
  { value: "lorelei", label: "Lorelei" },
  { value: "micah", label: "Micah" },
];


const AvatarSelector = ({ onClose }) => {
  const { user, updateAvatar } = useAuth();

  const handleSelect = async (style) => {
    await updateAvatar(style);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Choose your avatar</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className={styles.grid}>
          {AVATAR_STYLES.map((style) => (
            <button
              key={style.value}
              className={`${styles.option} ${user?.avatar_style === style.value ? styles.active : ""}`}
              onClick={() => handleSelect(style.value)}
            >
              <img
                src={getAvatarUrl(style.value, user?.email, 80)}
                alt={style.label}
              />
              <span>{style.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
