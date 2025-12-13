import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface ContributorAvatarProps {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
}

export function ContributorAvatar({ src, alt, fallback, className }: ContributorAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="text-[9px]">{fallback}</AvatarFallback>
    </Avatar>
  )
}