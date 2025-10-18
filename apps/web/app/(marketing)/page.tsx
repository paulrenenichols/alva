import { EmailCaptureForm } from '@/components/forms/EmailCaptureForm';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-secondary-900 mb-6">
            Your AI Marketing Assistant
          </h1>
          <p className="text-xl text-secondary-600 mb-12">
            Get a personalized marketing plan in minutes, not months
          </p>
          <EmailCaptureForm />
        </div>
      </div>
    </div>
  );
}
