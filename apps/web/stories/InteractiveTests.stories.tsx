/**
 * @fileoverview Storybook stories for interactive component testing
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { useState } from 'react';

const meta: Meta = {
  title: 'Design System/Interactive Tests',
  parameters: {
    docs: {
      description: {
        component:
          'Interactive component testing with user interactions and state management.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ButtonInteractions: Story = {
  render: () => {
    const [clickCount, setClickCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
      setClickCount((prev) => prev + 1);
    };

    const handleLoadingClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Button Interactions</h2>
          <p className="text-text-secondary mb-4">
            Test button interactions and state changes.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Click Counter</h3>
              <div className="flex items-center gap-4">
                <Button variant="primary" onClick={handleClick}>
                  Click Me
                </Button>
                <span className="text-text-secondary">
                  Clicked {clickCount} times
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Loading State</h3>
              <Button
                variant="secondary"
                loading={loading}
                onClick={handleLoadingClick}
              >
                {loading ? 'Loading...' : 'Start Loading'}
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Hover Effects</h3>
              <div className="flex gap-2">
                <Button variant="primary">Hover Me</Button>
                <Button variant="secondary">Hover Me</Button>
                <Button variant="ghost">Hover Me</Button>
                <Button variant="destructive">Hover Me</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const FormInteractions: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange =
      (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));

        // Clear error when user starts typing
        if (errors[field as keyof typeof errors]) {
          setErrors((prev) => ({
            ...prev,
            [field]: '',
          }));
        }
      };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const newErrors: any = {};
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.message) newErrors.message = 'Message is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        setSubmitted(true);
        setErrors({});
      }
    };

    if (submitted) {
      return (
        <div className="max-w-md mx-auto text-center">
          <Card variant="elevated">
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                Form Submitted!
              </h3>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">
                Thank you for your submission. We'll get back to you soon.
              </p>
            </CardBody>
            <CardFooter>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', message: '' });
                }}
              >
                Submit Another
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Form Interactions</h2>
          <p className="text-text-secondary mb-4">
            Test form interactions, validation, and state management.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <Input
              label="Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
            />

            <Input
              label="Message"
              placeholder="Enter your message"
              value={formData.message}
              onChange={handleInputChange('message')}
              error={!!errors.message}
              helperText={errors.message}
            />

            <div className="flex gap-2">
              <Button type="submit" variant="primary" className="flex-1">
                Submit
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setFormData({ name: '', email: '', message: '' });
                  setErrors({});
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  },
};

export const CardInteractions: Story = {
  render: () => {
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const cards = [
      { id: 1, title: 'Card 1', description: 'This is the first card' },
      { id: 2, title: 'Card 2', description: 'This is the second card' },
      { id: 3, title: 'Card 3', description: 'This is the third card' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Card Interactions</h2>
          <p className="text-text-secondary mb-4">
            Test card interactions including hover, click, and selection states.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card) => (
              <Card
                key={card.id}
                variant={
                  selectedCard === card.id ? 'highlighted' : 'interactive'
                }
                className={`cursor-pointer transition-all ${
                  hoveredCard === card.id ? 'scale-105' : ''
                }`}
                onClick={() =>
                  setSelectedCard(selectedCard === card.id ? null : card.id)
                }
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {card.title}
                  </h3>
                </CardHeader>
                <CardBody>
                  <p className="text-text-secondary">{card.description}</p>
                  {selectedCard === card.id && (
                    <p className="text-sm text-primary mt-2 font-medium">
                      ✓ Selected
                    </p>
                  )}
                  {hoveredCard === card.id && (
                    <p className="text-sm text-text-tertiary mt-2">
                      Hovering...
                    </p>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="mt-4 p-4 bg-bg-secondary rounded-lg">
            <p className="text-text-secondary">
              Selected card: {selectedCard ? `Card ${selectedCard}` : 'None'}
            </p>
            <p className="text-text-secondary">
              Hovered card: {hoveredCard ? `Card ${hoveredCard}` : 'None'}
            </p>
          </div>
        </div>
      </div>
    );
  },
};

export const ThemeToggleInteraction: Story = {
  render: () => {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
      setIsDark(!isDark);
    };

    return (
      <div className={`space-y-6 ${isDark ? 'dark' : ''}`}>
        <div>
          <h2 className="text-xl font-bold mb-4">Theme Toggle Interaction</h2>
          <p className="text-text-secondary mb-4">
            Test theme switching and its effects on components.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="primary" onClick={toggleTheme}>
                {isDark ? 'Switch to Light' : 'Switch to Dark'}
              </Button>
              <span className="text-text-secondary">
                Current theme: {isDark ? 'Dark' : 'Light'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card variant="elevated">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-text-primary">
                    Theme Test Card
                  </h3>
                </CardHeader>
                <CardBody>
                  <p className="text-text-secondary">
                    This card adapts to the current theme.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="primary" size="sm">
                      Primary
                    </Button>
                    <Button variant="secondary" size="sm">
                      Secondary
                    </Button>
                  </div>
                </CardBody>
              </Card>

              <div className="space-y-2">
                <Input
                  label="Theme Test Input"
                  placeholder="Type something..."
                />
                <Input label="Another Input" placeholder="More text here..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const UserFlowTest: Story = {
  render: () => {
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({
      name: '',
      email: '',
      preferences: '',
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const steps = [
      { title: 'Personal Info', description: 'Tell us about yourself' },
      { title: 'Contact Details', description: 'How can we reach you?' },
      { title: 'Preferences', description: 'What are your interests?' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">User Flow Test</h2>
          <p className="text-text-secondary mb-4">
            Test a complete user flow with multiple steps and interactions.
          </p>

          <div className="max-w-2xl mx-auto">
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {steps[step - 1].title}
                    </h3>
                    <p className="text-text-secondary">
                      {steps[step - 1].description}
                    </p>
                  </div>
                  <div className="text-sm text-text-tertiary">
                    Step {step} of 3
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                <div className="space-y-4">
                  {step === 1 && (
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  )}

                  {step === 2 && (
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  )}

                  {step === 3 && (
                    <Input
                      label="Preferences"
                      placeholder="Tell us about your interests"
                      value={userData.preferences}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          preferences: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              </CardBody>

              <CardFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="secondary"
                    onClick={prevStep}
                    disabled={step === 1}
                  >
                    Previous
                  </Button>

                  {step < 3 ? (
                    <Button variant="primary" onClick={nextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => {
                        alert('Flow completed!');
                        setStep(1);
                        setUserData({ name: '', email: '', preferences: '' });
                      }}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  },
};
