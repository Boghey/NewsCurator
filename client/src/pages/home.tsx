import { useState } from "react";
import LinkForm from "@/components/link-form";
import LinkList from "@/components/link-list";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Link } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag } from "lucide-react";

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string>();

  const { data: links } = useQuery<Link[]>({
    queryKey: ["/api/links"],
  });

  const uniqueTags = Array.from(
    new Set(links?.flatMap((link) => link.tags || []) || [])
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed header with tag filter */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container py-4">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Link Collector
          </h1>

          {uniqueTags.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Tag className="h-4 w-4 flex-shrink-0" />
              <ScrollArea className="w-full" orientation="horizontal">
                <div className="flex gap-2">
                  <Badge
                    variant={selectedTag ? "outline" : "default"}
                    className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm"
                    onClick={() => setSelectedTag(undefined)}
                  >
                    All Links
                  </Badge>
                  {uniqueTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="container flex-1 py-6">
        <LinkForm />
        <LinkList selectedTag={selectedTag} />
      </div>
    </div>
  );
}