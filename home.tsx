import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { 
  useGetDashboardStats, 
  getGetDashboardStatsQueryKey,
  useGetTrendingQuestions,
  getGetTrendingQuestionsQueryKey,
  useGetCategoryStats,
  getGetCategoryStatsQueryKey,
  useGetRecentActivity,
  getGetRecentActivityQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, CheckCircle2, Zap, Clock, Activity, ArrowRight, BrainCircuit, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function Home() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({ query: { queryKey: getGetDashboardStatsQueryKey() } });
  const { data: trending, isLoading: trendingLoading } = useGetTrendingQuestions({ query: { queryKey: getGetTrendingQuestionsQueryKey() } });
  const { data: categories, isLoading: categoriesLoading } = useGetCategoryStats({ query: { queryKey: getGetCategoryStatsQueryKey() } });
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity({ query: { queryKey: getGetRecentActivityQueryKey() } });

  return (
    <Layout>
      <div className="space-y-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border bg-card p-8 md:p-12 shadow-sm">
          <div className="absolute top-0 right-0 w-full h-full bg-opal-gradient opacity-5 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Where knowledge moves <span className="text-opal-gradient">at the speed of thought.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Ask questions, share expertise, and build your reputation in a vibrant community powered by real people and verified by AI.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/community" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                Open Community
              </Link>
              <Link href="/ask" className="inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Ask Something
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={MessageSquare} label="Questions" value={stats?.totalQuestions} loading={statsLoading} />
          <StatCard icon={CheckCircle2} label="Answers" value={stats?.totalAnswers} loading={statsLoading} />
          <StatCard icon={Users} label="Users" value={stats?.totalUsers} loading={statsLoading} />
          <StatCard icon={BrainCircuit} label="AI Verified" value={stats?.aiAnsweredCount} loading={statsLoading} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trending Questions */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" /> Trending Now
                </h2>
                <Link href="/community?sort=popular" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {trendingLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse h-32" />
                  ))
                ) : trending?.length ? (
                  trending.map(q => (
                    <Card key={q.id} className="hover:border-primary/50 transition-colors group">
                      <CardContent className="p-5 flex gap-4">
                        <div className="flex flex-col items-center justify-center min-w-16 bg-muted/50 rounded-lg p-2 h-fit">
                          <Heart className="w-4 h-4 text-rose-500" />
                          <span className="font-bold text-lg">{q.voteCount}</span>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">likes</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/questions/${q.id}`} className="text-lg font-medium hover:text-primary transition-colors line-clamp-1">
                            {q.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="font-mono text-xs">{q.category}</Badge>
                            <span>•</span>
                            <span>{q.answerCount} answers</span>
                            <span>•</span>
                            <span>Asked by {q.authorDisplayName}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card><CardContent className="p-8 text-center text-muted-foreground">No trending questions yet.</CardContent></Card>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Top Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categoriesLoading ? (
                    <div className="h-32 animate-pulse bg-muted rounded" />
                  ) : categories?.map(c => (
                    <Link key={c.category} href={`/community?category=${c.category}`} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                      <span className="font-medium text-sm">{c.category}</span>
                      <Badge variant="outline">{c.count}</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-3 before:w-[2px] before:bg-border">
                  {activityLoading ? (
                    <div className="h-48 animate-pulse bg-muted rounded" />
                  ) : activity?.map(item => (
                    <div key={`${item.type}-${item.id}`} className="relative pl-8">
                      <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full border-2 border-background bg-primary" />
                      <p className="text-sm">
                        <span className="font-medium">{item.username}</span>
                        <span className="text-muted-foreground mx-1">
                          {item.type === 'question' ? 'asked' : item.type === 'answer' ? 'answered' : 'AI verified'}
                        </span>
                        <span className="text-foreground line-clamp-1 italic">"{item.title}"</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon: Icon, label, value, loading }: { icon: any, label: string, value?: number, loading: boolean }) {
  return (
    <Card className="overflow-hidden relative group">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <Icon className="w-6 h-6 text-primary mb-3" />
        {loading ? (
          <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1" />
        ) : (
          <div className="text-3xl font-display font-bold mb-1">{value?.toLocaleString() || 0}</div>
        )}
        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
      </CardContent>
    </Card>
  );
}
