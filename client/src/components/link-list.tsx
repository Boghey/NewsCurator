import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Link } from "../shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link2, Trash2, Calendar, Edit, Save, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type LinkListProps = {
  links?: Link[];
  onTagClick?: (tag: string) => void;
};

export default function LinkList({ links, onTagClick }: LinkListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [notesInput, setNotesInput] = useState("");

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

  const updateNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const res = await apiRequest("PATCH", `/api/links/${id}/notes`, { notes });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      setEditingNotes(null);
      toast({
        title: "Success",
        description: "Notes updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notes",
        variant: "destructive",
      });
    },
  });

  const handleEditNotes = (link: Link) => {
    setEditingNotes(link.id);
    setNotesInput(link.notes || "");
  };

  const handleSaveNotes = (id: number) => {
    updateNotes.mutate({ id, notes: notesInput });
  };

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
                  <div className="space-y-1">
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
                    {link.publishedDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(link.publishedDate), 'PPP')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditNotes(link)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteLink.mutate(link.id)}
                      disabled={deleteLink.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {editingNotes === link.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Add your notes..."
                    />
                    <Button
                      onClick={() => handleSaveNotes(link.id)}
                      disabled={updateNotes.isPending}
                      size="sm"
                    >
                      {updateNotes.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Notes
                    </Button>
                  </div>
                ) : (
                  link.notes && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {link.notes}
                    </p>
                  )
                )}

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