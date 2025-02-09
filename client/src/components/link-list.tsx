import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Link } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link2, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type LinkListProps = {
  links?: Link[];
  onTagClick?: (tag: string) => void;
};

export default function LinkList({ links, onTagClick }: LinkListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteLink = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({
        title: "Success",
        description: "Link deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    },
  });

  if (!links) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!links.length) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No links found
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-4">
        {links.map((link) => (
          <Card key={link.id}>
            <CardContent className="pt-6 grid md:grid-cols-[200px,1fr] gap-4">
              {link.imageUrl && (
                <div className="relative aspect-video">
                  <img
                    src={link.imageUrl}
                    alt={link.title}
                    className="object-cover rounded-md w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                    }}
                  />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-lg font-semibold line-clamp-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-2"
                    >
                      {link.title}
                      <Link2 className="h-4 w-4" />
                    </a>
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLink.mutate(link.id)}
                    disabled={deleteLink.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(link.tags || []).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => onTagClick?.(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}