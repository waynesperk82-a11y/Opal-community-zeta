import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { useListQuestions, getListQuestionsQueryKey } from "@workspace/api-client-react";
import { ListQuestionsParams, ListQuestionsSort, ListQuestionsStatus } from "@workspace/api-client-react/src/generated/api.schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Search, Heart, PlusCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function Questions() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [params, setParams] = useState<ListQuestionsParams>({
    sort: (searchParams.get("sort") as ListQuestionsSort) || "recent",
    status: (searchParams.get("status") as ListQuestionsStatus) || undefined,
    category: searchParams.get("category") || undefined,
    search: searchParams.get("search") || undefined,
    page: 1,
    limit: 20
  });

  const [searchInput, setSearchInput] = useState(params.search || "");

  // Update URL when filters change
  useEffect(() => {
    const urlParams = new URLSearchParams();
    if (params.sort && params.sort !== "recent") urlParams.set("sort", params.sort);
    if (params.status) urlParams.set("status", params.status);
    if (params.category) urlParams.set("category", params.category);
    if (params.search) urlParams.set("search", params.search);
    
    const qs = urlParams.toString();
    const newUrl = qs ? `/community?${qs}` : "/community";
    if (newUrl !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [params]);

  const { data, isLoading } = useListQuestions(params, { 
    query: { queryKey: getListQuestionsQueryKey(params) } 
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(p => ({ ...p, search: searchInput || undefined, page: 1 }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Community Questions & Answers</h1>
            <p className="text-muted-foreground mt-1">Post questions, browse answers, and see what the AI has verified.</p>
          </div>
          
          <Link href="/ask">
            <Button className="gap-2 w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all rounded-full">
              <PlusCircle className="w-4 h-4" /> Ask Question
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-card border rounded-xl p-4 shadow-sm space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search questions..." 
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="pl-9 bg-background rounded-full"
              />
            </div>
            <Button type="submit" variant="secondary" className="rounded-full px-6">Search</Button>
          </form>

          <div className="flex flex-wrap gap-3">
            <Select value={params.sort || "recent"} onValueChange={(v) => setParams(p => ({ ...p, sort: v as ListQuestionsSort, page: 1 }))}>
              <SelectTrigger className="w-[140px] rounded-full h-9 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Newest</SelectItem>
                <SelectItem value="popular">Most Votes</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
              </SelectContent>
            </Select>

            <Select value={params.status || "all"} onValueChange={(v) => setParams(p => ({ ...p, status: v === "all" ? undefined : v as ListQuestionsStatus, page: 1 }))}>
              <SelectTrigger className="w-[140px] rounded-full h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="ai_answered">AI Verified</SelectItem>
              </SelectContent>
            </Select>
            
            {params.category && (
              <Badge variant="secondary" className="h-9 px-3 gap-1 rounded-full flex items-center">
                {params.category}
                <button onClick={() => setParams(p => ({ ...p, category: undefined, page: 1 }))} className="ml-1 hover:text-destructive rounded-full">×</button>
              </Badge>
            )}
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-32 rounded-xl" />
            ))
          ) : data?.questions.length ? (
            <div className="space-y-4">
              {data.questions.map(q => (
                <Card key={q.id} className="hover:border-primary/40 transition-all duration-200 group rounded-xl overflow-hidden shadow-sm hover:shadow-md">
                  <CardContent className="p-0 flex flex-col sm:flex-row">
                    <div className="p-4 sm:p-6 bg-muted/30 flex flex-row sm:flex-col justify-around sm:justify-start items-center gap-4 sm:gap-2 min-w-24 border-b sm:border-b-0 sm:border-r">
                      <div className="flex flex-col items-center text-center">
                        <Heart className="w-4 h-4 text-rose-500 mb-1" />
                        <span className="font-bold text-lg leading-none">{q.voteCount}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">likes</span>
                      </div>
                      <div className={`flex flex-col items-center text-center px-3 py-1 rounded-md ${q.answerCount > 0 ? (q.status === 'ai_answered' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-primary/10 text-primary border border-primary/20') : 'text-muted-foreground'}`}>
                        <span className="font-bold text-lg leading-none">{q.answerCount}</span>
                        <span className="text-xs uppercase tracking-wider mt-1">answers</span>
                      </div>
                      <div className="flex flex-col items-center text-center text-muted-foreground hidden sm:flex">
                        <span className="font-medium text-sm leading-none">{q.viewCount}</span>
                        <span className="text-[10px] uppercase tracking-wider mt-1">views</span>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider rounded-md border-primary/30 text-primary cursor-pointer hover:bg-primary/5" onClick={(e) => { e.preventDefault(); setParams(p => ({...p, category: q.category})); }}>
                            {q.category}
                          </Badge>
                          {q.status === 'ai_answered' && (
                            <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20 font-mono text-[10px] uppercase tracking-wider rounded-md border-0">
                              AI Verified
                            </Badge>
                          )}
                        </div>
                        <Link href={`/questions/${q.id}`} className="text-xl font-display font-bold hover:text-primary transition-colors mb-2 block line-clamp-2">
                          {q.title}
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {q.body}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
                        <div className="flex flex-wrap gap-2">
                          {q.tags.slice(0, 4).map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground rounded-md text-[10px] uppercase tracking-wider border-0 font-mono">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-white text-[10px] font-bold overflow-hidden">
                            {q.authorAvatarUrl ? <img src={q.authorAvatarUrl} alt={q.authorDisplayName} className="h-full w-full object-cover" /> : q.authorDisplayName.charAt(0)}
                          </div>
                          <span>
                            <span className="font-medium text-foreground">{q.authorDisplayName}</span> asked {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-xl border-dashed">
              <CardContent className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">No questions found</h3>
                <p className="text-muted-foreground mb-6">We couldn't find any questions matching your filters.</p>
                <Button variant="outline" onClick={() => setParams({ page: 1, limit: 20 })} className="rounded-full">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full px-6"
                disabled={params.page === 1}
                onClick={() => setParams(p => ({ ...p, page: (p.page || 1) - 1 }))}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">Page {data.page} of {data.totalPages}</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full px-6"
                disabled={params.page === data.totalPages}
                onClick={() => setParams(p => ({ ...p, page: (p.page || 1) + 1 }))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
