// components/ServiceCard.tsx
import Image, { StaticImageData } from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc?: string | StaticImageData;
  className?: string;
}

export function ServiceCard({ title, description, imageSrc, className = "" }: ServiceCardProps) {
  return (
    <Card className={`bg-card text-card-foreground shadow-xl hover:ring-2 hover:ring-primary transition duration-300 ease-in-out group relative overflow-hidden ${className}`}>
      {/* Conditional Background Image or Placeholder */}
      {imageSrc ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt={`${title} graphic`}
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-40 transition-opacity duration-300 ease-in-out group-hover:opacity-70"
          />
          {/* Overlay gradient for blending */}
          <div className="absolute inset-0 z-10" style={{
            background: 'radial-gradient(circle at center, transparent 0%, var(--card) 70%)',
          }}/>
        </div>
      ) : (
        // Placeholder div when imageSrc is not provided
        <div className="absolute inset-0 z-0 bg-gray-700/50 flex items-center justify-center">
          <span className="text-sm text-gray-400">Image Placeholder</span>
        </div>
      )}

      <CardContent className="relative z-20 p-6 flex flex-col gap-4 h-full justify-end">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}