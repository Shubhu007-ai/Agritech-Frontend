const ErrorBox = ({ message, onRetry }) => {
  return (
    <div style={{
      background: "#ffdddd",
      padding: "12px",
      borderRadius: "8px",
      margin: "15px 0",
      color: "#a94442",
      borderLeft: "5px solid #a94442"
    }}>
      <p>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: "10px",
            padding: "6px 12px",
            background: "#a94442",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorBox;
