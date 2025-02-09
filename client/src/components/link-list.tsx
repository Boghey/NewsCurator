import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Link } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link2, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type LinkListProps = {
  selectedTag?: string;
};

export default function LinkList({ selectedTag }: LinkListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: links, isLoading } = useQuery<Link[]>({
    queryKey: selectedTag ? ["/api/links/tag", selectedTag] : ["/api/links"],
  });

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

  if (isLoading) {
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

  if (!links?.length) {
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
      <div className="space-y-4 pr-4">
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
                  <CardTitle className="text-lg line-clamp-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-2"
                    >
                      {link.title}
                      <Link2 className="h-4 w-4" />
                    </a>
                  </CardTitle>
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
                    <Badge key={tag} variant="secondary">
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