import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Author {
  id: string;
  name: string;
  avatar: string;
  isRegistered: boolean;
}

interface AuthorBadgeProps {
  author: Author;
}

export function AuthorBadge({ author }: AuthorBadgeProps) {
  if (!author) return null;
  
  return (
    <div className="flex items-center gap-2 bg-secondary/30 pr-3 pl-1 py-1 rounded-full border border-border/40 transition-colors hover:bg-secondary/60">
      <Avatar className="h-7 w-7 border-2 border-background">
        <AvatarImage 
            src={author.avatar} 
            alt={author.name} 
            className="object-cover" 
        />
        <AvatarFallback className="text-[10px]">
          {author.name ? author.name.substring(0, 2).toUpperCase() : "??"}
        </AvatarFallback>
      </Avatar>
      
      {author.isRegistered ? (
        <a 
          href={`/authors/${author.id}`} 
          className="text-sm font-medium text-foreground hover:underline decoration-primary/50 underline-offset-4"
        >
          {author.name}
        </a>
      ) : (
        <span className="text-sm font-medium text-foreground">
          {author.name}
        </span>
      )}
    </div>
  )
}