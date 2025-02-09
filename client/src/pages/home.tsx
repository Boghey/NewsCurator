import { useState } from "react";
import LinkForm from "@/components/link-form";
import LinkList from "@/components/link-list";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Link } from "@shared/schema";

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string>();

  const { data: links } = useQuery<Link[]>({
    queryKey: ["/api/links"],
  });

  const uniqueTags = Array.from(
    new Set(links?.flatMap((link) => link.tags || []) || [])
  );

  return (
    <div className="container py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Link Collector
      </h1>

      {/* Move tags to top for better mobile visibility */}
      {uniqueTags.length > 0 && (
        <div className="mb-6 bg-muted/50 p-4 rounded-lg">
          <h2 className="font-semibold mb-3 text-lg">Filter by Tags</h2>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={selectedTag ? "outline" : "default"}
              className="cursor-pointer px-4 py-2 text-base"
              onClick={() => setSelectedTag(undefined)}
            >
              All
            </Badge>
            {uniqueTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-base"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <LinkForm />
      <LinkList selectedTag={selectedTag} />
    </div>
  );
}