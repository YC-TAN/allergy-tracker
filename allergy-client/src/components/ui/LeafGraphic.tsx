const LeafGraphic = () => {
  return (
    <div className="text-center mb-6 flex-1">
      <div
        aria-hidden="true"
        className="flex items-center justify-center my-4 mx-auto"
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "#f0f7f0",
          border: "2px solid #a5d6a7",
          fontSize: 32,
        }}
      >
        🌿
      </div>
    </div>
  );
};

export default LeafGraphic;
