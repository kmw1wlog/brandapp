import Image from "next/image";

export function BranchImage({ src, alt, className = "", priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 42vw, (min-width: 640px) 80vw, 100vw"
      priority={priority}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
