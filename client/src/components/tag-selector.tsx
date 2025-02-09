import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TagSelectorProps {
  tags: string[];
  selectedTag?: string;
  onSelect: (tag?: string) => void;
}

export default function TagSelector({ tags, selectedTag, onSelect }: TagSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between min-w-[200px]"
        >
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            {selectedTag ? (
              <Badge variant="secondary" className="mr-2">
                {selectedTag}
              </Badge>
            ) : (
              "Filter by tag..."
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandEmpty>No tags found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                onSelect(undefined);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !selectedTag ? "opacity-100" : "opacity-0"
                )}
              />
              All Tags
            </CommandItem>
            {tags.map((tag) => (
              <CommandItem
                key={tag}
                onSelect={() => {
                  onSelect(tag);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedTag === tag ? "opacity-100" : "opacity-0"
                  )}
                />
                {tag}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
