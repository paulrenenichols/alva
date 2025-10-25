/**
 * @fileoverview Login page component for user authentication
 */

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-text-secondary">
            Enter your email to receive a magic link
          </p>
        </div>
        {/* Login form will be implemented in Phase 2 */}
      </div>
    </div>
  );
}
