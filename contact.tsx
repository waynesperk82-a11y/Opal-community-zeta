import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Send } from "lucide-react";

export function Contact() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="relative overflow-hidden rounded-3xl border bg-card p-8 md:p-12 text-center shadow-sm">
          <div className="absolute inset-0 bg-opal-gradient opacity-10 pointer-events-none" />
          <div className="relative space-y-5">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-opal-gradient animate-gradient-xy flex items-center justify-center text-white shadow-lg">
              <Mail className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">Contact Opal Zeta</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question, idea, report, or partnership request? Reach the Opal Zeta team directly through email.
            </p>
          </div>
        </section>

        <Card className="rounded-3xl overflow-hidden">
          <div className="h-2 bg-opal-gradient" />
          <CardContent className="p-8 md:p-10 text-center space-y-6">
            <MessageCircle className="h-10 w-10 text-primary mx-auto" />
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground font-mono mb-2">Official contact email</p>
              <a
                href="mailto:opalzeta172@gmail.com"
                className="text-2xl md:text-4xl font-display font-bold text-opal-gradient break-all"
                data-testid="link-contact-email"
              >
                opalzeta172@gmail.com
              </a>
            </div>
            <Button asChild className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href="mailto:opalzeta172@gmail.com" data-testid="button-email-opal-zeta">
                <Send className="h-4 w-4 mr-2" /> Send Email
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
