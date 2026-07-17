export const metadata = {
  title: "Privacy Policy | ApplyGenie",
  description: "Privacy Policy for ApplyGenie.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground font-heading mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last Updated: July 17, 2026</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us when you create an account, update your profile, 
              upload your resume, or communicate with us. This may include your name, email address, employment history, 
              skills, and other professional information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to provide, maintain, and improve our services, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Matching your profile with relevant job listings.</li>
              <li>Generating tailored resumes and cover letters using AI.</li>
              <li>Sending you technical notices, updates, and support messages.</li>
              <li>Personalizing your experience on the platform.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. AI Processing</h2>
            <p className="text-muted-foreground mb-4">
              ApplyGenie uses third-party AI services (like OpenAI) to power features such as resume optimization 
              and cover letter generation. The professional data you provide (like your resume and targeted job descriptions) 
              is transmitted to these services securely for processing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational security measures designed to protect the security 
              of any personal information we process. However, despite our safeguards and efforts to secure your information, 
              no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Your Privacy Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have the right to request access to the personal information we collect 
              from you, change that information, or delete it. To request to review, update, or delete your personal 
              information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions or comments about this notice, you may email us at privacy@applygenie.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
