import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { useUser as useClerkUser } from "@clerk/react";
import { useUser } from "@/lib/user-context";
import { useGetQuestion, getGetQuestionQueryKey, useCreateAnswer, useLikeQuestion, useLikeAnswer, useAcceptAnswer, useTriggerAiAnswerCheck } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, MessageSquare, BrainCircuit, Share2, AlertTriangle, Zap, Heart } from "lucide-react";

export function QuestionDetail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { user } = useUser();
  const { isSignedIn } = useClerkUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data, isLoading, error } = useGetQuestion(id, { 
    query: { 
      enabled: !isNaN(id), 
      queryKey: getGetQuestionQueryKey(id) 
    } 
  });

  const createAnswer = useCreateAnswer({
    mutation: {
      onSuccess: () => {
        setNewAnswer("");
        queryClient.invalidateQueries({ queryKey: getGetQuestionQueryKey(id) });
        toast({ title: "Answer submitted", description: "Your answer has been posted and queued for AI verification." });
      }
    }
  });

  const likeQuestion = useLikeQuestion({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetQuestionQueryKey(id) })
    }
  });

  const likeAnswer = useLikeAnswer({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetQuestionQueryKey(id) })
    }
  });

  const acceptAnswer = useAcceptAnswer({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetQuestionQueryKey(id) });
        toast({ title: "Answer accepted", description: "This answer has been marked as the solution." });
      }
    }
  });

  const triggerAi = useTriggerAiAnswerCheck({
    mutation: {
      onSuccess: () => {
        toast({ title: "AI check triggered", description: "Checking unverified answers..." });
        setTimeout(() => queryClient.invalidateQueries({ queryKey: getGetQuestionQueryKey(id) }), 2000);
      }
    }
  });

  const [newAnswer, setNewAnswer] = useState("");

  const handleQuestionLike = () => {
    if (!user || !isSignedIn) {
      toast({ title: "Sign in to like posts", variant: "destructive" });
      return;
    }
    likeQuestion.mutate({ id });
  };

  const handleAnswerLike = (answerId: number) => {
    if (!user || !isSignedIn) {
      toast({ title: "Sign in to like answers", variant: "destructive" });
      return;
    }
    likeAnswer.mutate({ id: answerId });
  };

  const handleAccept = (answerId: number) => {
    acceptAnswer.mutate({ id: answerId });
  };

  const submitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isSignedIn || !newAnswer.trim()) return;
    createAnswer.mutate({ questionId: id, data: { body: newAnswer } });
  };

  if (isNaN(id) || error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <h1 className="text-3xl font-display font-bold mb-2">Question not found</h1>
          <p className="text-muted-foreground mb-6">The question you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation("/questions")} className="rounded-full">Back to Questions</Button>
        </div>
      </Layout>
    );
  }

  if (isLoading || !data) {
    return (
      <Layout>
        <div className="space-y-8 animate-pulse">
          <div className="h-8 w-3/4 bg-muted rounded"></div>
          <div className="h-40 bg-card rounded-xl"></div>
          <div className="h-8 w-1/4 bg-muted rounded"></div>
          <div className="h-32 bg-card rounded-xl"></div>
        </div>
      </Layout>
    );
  }

  const { question, answers } = data;
  const isAuthor = user?.id === question.authorId;

  // Sort answers: Accepted first, then highest votes, then newest
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    if (a.voteCount !== b.voteCount) return b.voteCount - a.voteCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Layout>
      <div className="space-y-8 pb-20">
        {/* Question Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider rounded-md border-primary/30 text-primary">
                  {question.category}
                </Badge>
                {question.status === 'ai_answered' && (
                  <Badge variant="secondary" className="bg-accent/10 text-accent font-mono text-[10px] uppercase tracking-wider rounded-md border-0">
                    <BrainCircuit className="w-3 h-3 mr-1" /> AI Verified
                  </Badge>
                )}
                {question.status === 'answered' && (
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 font-mono text-[10px] uppercase tracking-wider rounded-md border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Answered
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight">{question.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                <span>Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
                <span>•</span>
                <span>Viewed {question.viewCount} times</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 ml-auto hidden md:flex" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({ title: "Link copied", description: "Question link copied to clipboard." });
                }}>
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
              </div>
            </div>
          </div>
          <Separator />
        </div>

        {/* Question Body */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Like Column */}
          <div className="flex md:flex-col items-center justify-start gap-2 pt-2 md:w-16 shrink-0">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-rose-500/10 hover:text-rose-500 transition-colors" onClick={handleQuestionLike} disabled={likeQuestion.isPending}>
              <Heart className="w-6 h-6" />
            </Button>
            <span className="text-xl font-bold font-display">{question.voteCount}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">likes</span>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 min-w-0">
            <div className="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap">
              {question.body}
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              {question.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground rounded-md text-xs uppercase tracking-wider border-0 font-mono">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 w-full md:w-64 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-sm overflow-hidden">
                  {question.authorAvatarUrl ? <img src={question.authorAvatarUrl} alt={question.authorDisplayName} className="h-full w-full object-cover" /> : question.authorDisplayName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Asked by</div>
                  <div className="font-medium text-primary">{question.authorDisplayName}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>
            {user?.username === 'admin' && (
              <Button variant="outline" size="sm" onClick={() => triggerAi.mutate()} disabled={triggerAi.isPending} className="gap-2 rounded-full font-mono text-xs uppercase tracking-wider">
                <Zap className="w-3 h-3" /> Force AI Check
              </Button>
            )}
          </div>
          
          <div className="space-y-8">
            {sortedAnswers.map(answer => (
              <Card key={answer.id} className={`rounded-xl border ${answer.isAccepted ? 'border-emerald-500/50 shadow-emerald-500/5 shadow-md relative overflow-hidden' : ''}`}>
                {answer.isAccepted && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full flex items-start justify-end p-3 pointer-events-none">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                )}
                <CardContent className="p-0 flex flex-col md:flex-row">
                  {/* Like Column */}
                  <div className="p-4 bg-muted/20 flex md:flex-col justify-center items-center gap-2 border-b md:border-b-0 md:border-r min-w-16 shrink-0">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-rose-500/10 hover:text-rose-500 transition-colors" onClick={() => handleAnswerLike(answer.id)} disabled={likeAnswer.isPending}>
                      <Heart className="w-5 h-5" />
                    </Button>
                    <span className="text-lg font-bold font-display">{answer.voteCount}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">likes</span>
                    {answer.isAccepted && (
                      <div className="mt-2 text-emerald-600 hidden md:block">
                        <CheckCircle2 className="w-6 h-6 mx-auto" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6 flex-1 flex flex-col min-w-0">
                    <div className="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap mb-6 flex-1">
                      {answer.body}
                    </div>

                    {/* AI Verification Badge/Note */}
                    {answer.isVerified ? (
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mb-6 text-sm flex gap-3 text-accent-foreground">
                        <BrainCircuit className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold font-display mb-1 text-accent">AI Verified</div>
                          <div className="text-muted-foreground leading-relaxed">{answer.verificationNote || "This answer has been verified for accuracy."}</div>
                        </div>
                      </div>
                    ) : answer.isAiGenerated ? (
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 mb-6 text-sm flex gap-3 text-amber-700 dark:text-amber-400">
                        <BrainCircuit className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold font-display mb-1">AI Generated Answer</div>
                          <div className="opacity-80 leading-relaxed">This is an automatic response. It has not been verified by human experts yet.</div>
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-auto">
                      <div>
                        {isAuthor && !question.status.includes('answered') && !answer.isAccepted && (
                          <Button variant="outline" size="sm" onClick={() => handleAccept(answer.id)} disabled={acceptAnswer.isPending} className="gap-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 rounded-full font-medium">
                            <CheckCircle2 className="w-4 h-4" /> Accept Solution
                          </Button>
                        )}
                      </div>
                      
                      <div className="bg-muted/30 rounded-xl p-3 w-full sm:w-auto flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${answer.isAiGenerated ? 'from-accent to-purple-600' : 'from-slate-400 to-slate-600'} flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden`}>
                          {answer.authorAvatarUrl ? <img src={answer.authorAvatarUrl} alt={answer.authorDisplayName} className="h-full w-full object-cover" /> : answer.authorDisplayName.charAt(0)}
                        </div>
                        <div className="text-sm">
                          <div className="text-muted-foreground text-xs">{formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</div>
                          <div className="font-medium">{answer.authorDisplayName}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {answers.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-medium">No answers yet</h3>
                <p className="text-muted-foreground">Be the first to share your knowledge.</p>
              </div>
            )}
          </div>
        </div>

        {/* Your Answer */}
        <div className="pt-8">
          <h2 className="text-2xl font-display font-bold mb-4">Your Answer</h2>
          {!isSignedIn && (
            <Card className="rounded-xl mb-4 border-primary/20 bg-primary/5">
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Sign in to answer</h3>
                  <p className="text-sm text-muted-foreground">Members can answer, like posts, and show their avatar in the community.</p>
                </div>
                <div className="flex gap-2">
                  <Link href="/sign-in"><Button variant="outline" className="rounded-full">Sign in</Button></Link>
                  <Link href="/sign-up"><Button className="rounded-full">Sign up</Button></Link>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="rounded-xl overflow-hidden border-2 focus-within:border-primary transition-colors">
            <form onSubmit={submitAnswer}>
              <Textarea 
                placeholder="Write a clear, detailed answer..." 
                className="min-h-[200px] border-0 focus-visible:ring-0 rounded-none resize-y p-4 text-base"
                value={newAnswer}
                onChange={e => setNewAnswer(e.target.value)}
              />
              <div className="bg-muted/50 p-4 border-t flex justify-between items-center">
                <div className="text-xs text-muted-foreground font-mono">
                  Markdown is supported.
                </div>
                <Button type="submit" disabled={!newAnswer.trim() || createAnswer.isPending || !isSignedIn} className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                  {createAnswer.isPending ? "Posting..." : "Post Answer"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
