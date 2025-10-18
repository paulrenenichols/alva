'use client';

interface OnboardingCardProps {
  cardId: string;
  sectionTitle: string;
  question: string;
  description?: string;
  children: React.ReactNode;
  isRequired?: boolean;
  validation?: (value: any) => boolean;
}

export function OnboardingCard({
  cardId,
  sectionTitle,
  question,
  description,
  children,
  isRequired = false,
  validation,
}: OnboardingCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-sm font-medium text-primary-600 mb-2">
              {sectionTitle}
            </h2>
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              {question}
            </h1>
            {description && (
              <p className="text-secondary-600">{description}</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            {children}
          </div>

          <div className="flex justify-between">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Back
            </button>
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}