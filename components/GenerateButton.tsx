"use client";

import { Button } from "@/components/ui/button";

interface Props {
  disabled: boolean;
  onClick: () => void;
}

export default function GenerateButton({ disabled, onClick }: Props) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-auto py-4 rounded-xl text-sm tracking-wide font-body font-medium active:scale-[0.99]"
    >
      Restyle this room
    </Button>
  );
}
