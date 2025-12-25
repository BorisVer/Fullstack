const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  let className = "notification";

  if (message.type === "error") {
    className = className + " error";
  } else {
    className = className + " success";
  }

  return <div className={className}>{message.text}</div>;
};

export default Notification;
