import { useState } from "react";
import LinkForm from "@/components/link-form";
import LinkList from "@/components/link-list";
import { useQuery } from "@tanstack/react-query";
import type { Link } from "@shared/schema";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import TagSelector from "@/components/tag-selector";

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: links } = useQuery<Link[]>({
    queryKey: ["/api/links"],
  });

  const uniqueTags = Array.from(
    new Set(links?.flatMap((link) => link.tags || []) || [])
  ).sort();

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

            {/* Tag selector */}
            {uniqueTags.length > 0 && (
              <TagSelector
                tags={uniqueTags}
                selectedTag={selectedTag}
                onSelect={setSelectedTag}
              />
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