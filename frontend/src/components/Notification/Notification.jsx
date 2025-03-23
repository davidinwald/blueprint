import PropTypes from "prop-types";
import "./Notification.css";

const Notification = ({ message, type }) => (
  <div className={`notification ${type}`}>
    {type === "success" && <span className="notification-icon">✓</span>}
    {message}
  </div>
);

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info", "warning"]).isRequired,
};

export default Notification;
