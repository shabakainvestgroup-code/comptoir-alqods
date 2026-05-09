import Image from "next/image";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center">
      <Image
        src="/images/logo-comptoir-alqods.png"
        alt="Comptoir AlQods"
        width={compact ? 300 : 260}
        height={compact ? 92 : 80}
        priority
        className={`${compact ? "h-14 w-auto sm:h-20" : "h-20 w-auto"} object-contain`}
      />
    </div>
  );
}
