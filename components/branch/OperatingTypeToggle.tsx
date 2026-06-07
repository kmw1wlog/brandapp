"use client";

export function OperatingTypeToggle({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const options = ["점포형", "배달형"];
  return (
    <div className="inline-flex rounded-lg border border-[#cbbda8] bg-white p-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-md px-3 py-2 text-sm font-black ${value === option ? "bg-[#164033] text-white" : "text-[#574d42]"}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
