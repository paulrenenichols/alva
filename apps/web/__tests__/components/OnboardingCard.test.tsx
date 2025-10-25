/**
 * @fileoverview Unit tests for OnboardingCard component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { useOnboardingStore } from '@/stores/onboardingStore';

// Mock the store
jest.mock('@/stores/onboardingStore');

const mockUseOnboardingStore = useOnboardingStore as jest.MockedFunction<
  typeof useOnboardingStore
>;

describe('OnboardingCard Component', () => {
  beforeEach(() => {
    mockUseOnboardingStore.mockReturnValue({
      currentSection: 1,
      currentCard: 1,
      responses: {},
      updateResponse: jest.fn(),
      nextCard: jest.fn(),
      prevCard: jest.fn(),
      getProgress: jest
        .fn()
        .mockReturnValue({ current: 1, total: 26, percentage: 4 }),
    });
  });

  it('renders card with question and description', () => {
    render(
      <OnboardingCard
        cardId="test-card"
        sectionTitle="Test Section"
        question="Test Question"
        description="Test Description"
      >
        <div>Test Content</div>
      </OnboardingCard>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls nextCard when Next button is clicked', () => {
    const mockNextCard = jest.fn();
    mockUseOnboardingStore.mockReturnValue({
      currentSection: 1,
      currentCard: 1,
      responses: {},
      updateResponse: jest.fn(),
      nextCard: mockNextCard,
      prevCard: jest.fn(),
      getProgress: jest
        .fn()
        .mockReturnValue({ current: 1, total: 26, percentage: 4 }),
    });

    render(
      <OnboardingCard
        cardId="test-card"
        sectionTitle="Test Section"
        question="Test Question"
      >
        <div>Test Content</div>
      </OnboardingCard>
    );

    fireEvent.click(screen.getByText('Next'));
    expect(mockNextCard).toHaveBeenCalled();
  });
});
