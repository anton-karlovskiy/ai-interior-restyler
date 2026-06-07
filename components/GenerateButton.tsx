"use client";

interface Props {
  disabled: boolean;
  onClick: () => void;
}

export default function GenerateButton({ disabled, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-accent text-bg font-body font-medium py-4 rounded-xl text-sm tracking-wide hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.99]"
    >
      Restyle this room
    </button>
  );
}
