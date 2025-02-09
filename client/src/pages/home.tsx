import { useState } from "react";
import LinkForm from "@/components/link-form";
import LinkList from "@/components/link-list";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Link } from "@shared/schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tag, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: links } = useQuery<Link[]>({
    queryKey: ["/api/links"],
  });

  const uniqueTags = Array.from(
    new Set(links?.flatMap((link) => link.tags || []) || [])
  );

  const filteredLinks = links?.filter((link) => {
    const matchesSearch = searchQuery === "" || 
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTag || link.tags?.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed header with search and tag filter */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container py-4">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Link Collector
          </h1>

          <div className="space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tags */}
            {uniqueTags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 flex-shrink-0" />
                <ScrollArea className="w-full">
                  <div className="flex gap-2 pb-2">
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
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container flex-1 py-6">
        <LinkForm />
        <LinkList links={filteredLinks} />
      </div>
    </div>
  );
}