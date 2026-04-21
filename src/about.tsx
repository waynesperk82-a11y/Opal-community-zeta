import Layout from "@/components/layout"
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, CheckCircle2, Clock, MessageSquare, ShieldCheck, Users } from "lucide-react";

export function About() {
  return (
    <Layout>
      <div className="space-y-10">
        <section className="relative overflow-hidden rounded-3xl border bg-card p-8 md:p-12 shadow-sm">
          <div className="absolute inset-0 bg-opal-gradient opacity-10 pointer-events-none" />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative max-w-3xl space-y-5">
            <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">About Opal Zeta</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
              A smarter community for questions, answers, and verified knowledge.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Opal Zeta is a community website where people can post questions, share answers, and learn from each other. Every human answer is reviewed by AI before it is shown as verified, helping keep the community useful, safe, and trustworthy.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <Feature icon={MessageSquare} title="Ask anything" text="Members can post detailed questions with categories and tags so the right people can find them." />
          <Feature icon={Users} title="Community answers" text="Other members can reply, vote on helpful answers, and build reputation by helping people solve problems." />
          <Feature icon={BrainCircuit} title="AI safety net" text="If a question has no answer after 24 hours, Opal Zeta AI creates a helpful answer so no question is left behind." />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl overflow-hidden">
            <div className="h-2 bg-opal-gradient" />
            <CardContent className="p-8 space-y-5">
              <h2 className="text-3xl font-display font-bold">How the website works</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  A person posts a question on the community page. Other people can answer it, vote on it, and mark the best solution. Before an answer becomes trusted, AI reviews it for quality, relevance, and safety.
                </p>
                <p>
                  If nobody answers a question within 24 hours, Opal Zeta AI steps in and writes an answer automatically. That keeps the community active and makes sure people are not ignored.
                </p>
                <p>
                  The goal is to combine human experience with AI verification so the answers feel fast, helpful, and more reliable than a normal forum.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Info icon={ShieldCheck} label="AI verifies answers" />
            <Info icon={Clock} label="Unanswered questions get AI help after 24 hours" />
            <Info icon={CheckCircle2} label="Best answers can be accepted as solutions" />
          </div>
        </section>
      </div>
    </Layout>
  );
}

function Feature({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <Card className="rounded-2xl hover:border-primary/40 transition-colors">
      <CardContent className="p-6">
        <Icon className="h-7 w-7 text-primary mb-4" />
        <h3 className="font-display font-bold text-xl mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
      </CardContent>
    </Card>
  );
}

function Info({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
      <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-medium">{label}</p>
    </div>
  );
}
