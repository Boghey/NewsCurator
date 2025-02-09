import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLinkSchema, type InsertLink } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import TagInput from "./tag-input";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LinkForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isScrapingMetadata, setIsScrapingMetadata] = useState(false);

  const form = useForm<InsertLink>({
    resolver: zodResolver(insertLinkSchema),
    defaultValues: {
      url: "",
      title: "",
      imageUrl: "",
      tags: [],
      scrapedTitle: null,
      scrapedImage: null,
    },
  });

  const createLink = useMutation({
    mutationFn: async (data: InsertLink) => {
      const res = await apiRequest("POST", "/api/links", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      form.reset();
      toast({
        title: "Success",
        description: "Link added successfully",
      });
    },
  });

  const handleUrlBlur = async () => {
    const url = form.getValues("url");
    if (!url) return;

    try {
      setIsScrapingMetadata(true);
      const res = await fetch("/api/links/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const { title, image } = await res.json();

      form.setValue("scrapedTitle", title);
      form.setValue("scrapedImage", image);
      if (title) form.setValue("title", title);
      if (image) form.setValue("imageUrl", image);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch metadata",
        variant: "destructive",
      });
    } finally {
      setIsScrapingMetadata(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createLink.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onBlur={() => {
                        field.onBlur();
                        handleUrlBlur();
                      }}
                      placeholder="https://example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      value={value || ""}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder="Enter image URL"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={createLink.isPending || isScrapingMetadata}
            >
              {(createLink.isPending || isScrapingMetadata) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isScrapingMetadata ? "Scraping Metadata..." : "Add Link"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}