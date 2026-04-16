import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { useUser as useClerkUser } from "@clerk/react";
import { useUser } from "@/lib/user-context";
import { useCreateQuestion } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, X, Sparkles } from "lucide-react";

const COMMON_CATEGORIES = [
  "Frontend", "Backend", "DevOps", "Database", "Mobile", "AI/ML", "Design", "Career"
];

export function Ask() {
  const { user } = useUser();
  const { isSignedIn } = useClerkUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const createQuestion = useCreateQuestion({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Question posted successfully" });
        setLocation(`/questions/${data.id}`);
      },
      onError: () => {
        toast({ title: "Failed to post question", variant: "destructive" });
      }
    }
  });

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (val && tags.length < 5 && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isSignedIn) {
      toast({ title: "Please sign in first", description: "Create an account to post questions.", variant: "destructive" });
      return;
    }
    
    if (!title || !body || !category) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    createQuestion.mutate({
      data: {
        title,
        body,
        category,
        tags
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        {!isSignedIn && (
          <Card className="rounded-2xl border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold">Sign in to ask the community</h2>
                <p className="text-muted-foreground">Your account avatar and name will appear beside your post.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/sign-in"><Button variant="outline" className="rounded-full">Sign in</Button></Link>
                <Link href="/sign-up"><Button className="rounded-full">Sign up</Button></Link>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="flex items-center gap-4 border-b pb-6">
          <div className="w-12 h-12 rounded-2xl bg-opal-gradient animate-gradient-xy flex items-center justify-center text-white shadow-lg">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Ask a Question</h1>
            <p className="text-muted-foreground mt-1">Post to the community page and get answers from people, verified by AI.</p>
          </div>
        </div>

        <Card className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
          <div className="h-2 bg-opal-gradient w-full" />
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-semibold">Title</Label>
                <p className="text-sm text-muted-foreground">Be specific and imagine you're asking a question to another person.</p>
                <Input 
                  id="title" 
                  placeholder="e.g. How to handle authentication state in Next.js App Router?" 
                  className="text-lg py-6 rounded-xl bg-background"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={150}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="body" className="text-base font-semibold">Details</Label>
                <p className="text-sm text-muted-foreground">Introduce the problem and expand on what you put in the title. Minimum 20 characters.</p>
                <Textarea 
                  id="body" 
                  placeholder="I'm trying to..." 
                  className="min-h-[250px] resize-y rounded-xl bg-background p-4 text-base leading-relaxed"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-base font-semibold">Category</Label>
                  <select 
                    id="category"
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {COMMON_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tags" className="text-base font-semibold">Tags</Label>
                  <p className="text-xs text-muted-foreground mb-1">Add up to 5 tags. Press Enter to add.</p>
                  <div className="flex flex-col gap-2">
                    <Input 
                      id="tags" 
                      placeholder="e.g. react, typescript, auth" 
                      className="rounded-xl bg-background"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleTagAdd}
                      disabled={tags.length >= 5}
                    />
                    <div className="flex flex-wrap gap-2 min-h-8">
                      {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1 font-mono text-xs gap-1 rounded-md bg-muted text-foreground hover:bg-muted/80">
                          #{tag}
                          <button 
                            type="button" 
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-muted-foreground hover:text-destructive rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      {tags.length === 0 && <span className="text-sm text-muted-foreground italic">No tags added</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 px-4 py-2 rounded-lg font-medium">
                  <Sparkles className="w-4 h-4" />
                  AI will attempt to answer automatically
                </div>
                
                <Button 
                  type="submit" 
                  disabled={createQuestion.isPending || !title || !body || !isSignedIn} 
                  className="w-full sm:w-auto rounded-full px-8 h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all font-semibold"
                >
                  {createQuestion.isPending ? "Publishing..." : "Post Question"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
