const StatusBadge = ({ date, gravity }) => {
  let bgColor = "bg-gray-400"; // Default color
  let textColor = "text-white"; // Default text color

  switch (gravity?.toLowerCase()) {
    case "critica":
      bgColor = "bg-red-600";
      break;
    case "alta":
      bgColor = "bg-orange-500";
      break;
    case "media":
      bgColor = "bg-yellow-400";
      textColor = "text-black";
      break;
    case "bassa":
      bgColor = "bg-green-500";
      break;
    default:
      bgColor = "bg-gray-400";
  }

  return (
    <div>

      <div className={`hidden sm:block px-2 py-1 ${textColor} text-center`} style={{ padding: "1rem" }}>
        <p className="text-xl font-bold capitalize">{date}</p>
      </div>

      <div className={`block sm:hidden py-1 px-3 ${bgColor} ${textColor} text-center rounded-full w-[fit-content]`}>
        <p className="text-[10px] font-bold capitalize">{date}</p>
      </div>

    </div>
  );
};

export default StatusBadge;
