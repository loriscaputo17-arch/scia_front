import Image from "next/image";

const elementIcons = {
  1: "/icons/facilities/Ico1.svg",
  2: "/icons/facilities/Ico2.svg",
  3: "/icons/facilities/Ico3.svg",
  4: "/icons/facilities/Ico4.svg",
  5: "/icons/facilities/Ico5.svg",
  6: "/icons/facilities/Ico6.svg",
  7: "/icons/facilities/Ico7.svg",
  8: "/icons/facilities/Ico8.svg",
  9: "/icons/facilities/Ico9.svg",
};

const getElementIcon = (elementId) => {
  if (!elementId) return null;

  // prende la prima cifra convertendo in stringa
  const firstDigit = parseInt(String(elementId)[0], 10);

  return elementIcons[firstDigit] || null;
};

const ElementIcon = ({ elementId }) => {
  const iconSrc = getElementIcon(elementId);
  if (!iconSrc) return null;

  return (
    <Image
      src={iconSrc}
      alt="Element Icon"
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: "1.5rem", height: "auto" }}
      className="inline-block mr-2 opacity-60"
    />
  );
};

export default ElementIcon;

