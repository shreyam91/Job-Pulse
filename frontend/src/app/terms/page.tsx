export const metadata = {
  title: "Terms of Service | ApplyGenie",
  description: "Terms of Service for ApplyGenie.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 sm:py-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground font-heading mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last Updated: July 17, 2026</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using ApplyGenie, you accept and agree to be bound by the terms and provision of this agreement. 
              In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              ApplyGenie provides an AI-powered job application platform that assists users in finding jobs, optimizing resumes, 
              and generating cover letters. The service is provided &quot;AS IS&quot; and we assume no responsibility for the timeliness, 
              deletion, or failure to store any user communications or personalization settings.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Conduct</h2>
            <p className="text-muted-foreground mb-4">
              You agree to use the Service only for lawful purposes. You agree not to take any action that might compromise the 
              security of the Service, render the Service inaccessible to others, or otherwise cause damage to the Service or the Content.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, 
              data compilations, and software, is the property of ApplyGenie or its content suppliers and protected by international 
              copyright laws.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall ApplyGenie be liable for any direct, indirect, incidental, special, or consequential damages 
              resulting from the use or the inability to use the service.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              ApplyGenie reserves the right, at its sole discretion, to modify or replace these Terms at any time. What constitutes 
              a material change will be determined at our sole discretion.
            </p>
          </section>
          
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              If you have any questions about these Terms, please contact us at support@applygenie.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
