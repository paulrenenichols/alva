# Paul MVP

## UX/UI Notes

# Alva Brand Guide

## 1\. Brand Core

- **Name:** Alva
- **Tagline:** _Bringing your marketing into the light._
- **Mission:** Provide small business owners with a custom marketing plan & a skilled, always-on marketing director at a fraction of the cost, without feeling like “just ChatGPT with a wrapper.” Then scale into an ecosystem of PPC, Blog, Email, Graphic Design & Web Dev Modules that reference the client specific needs continually for tailored recommendations.
- **Personality:** Sharp, confident, warm, and direct \- like a strategist who cuts through the noise while making you feel in control.
- **Core Values:** Clarity, Precision, Empowerment, Adaptation

## 2\. Brand Voice

- **Tone:**
  - Professional but approachable
  - Confident, never arrogant
  - Strategic, never fluffy
- **Language Style:**
  - Plain English, no jargon without context
  - Short, punchy sentences when giving advice; warmer phrasing in onboarding
  - Use “you” more than “we” to keep it customer-focused

**Example Phrasing:**

- Onboarding: “I’ll guide you step-by-step. You won’t need to guess your next move again.”
- Strategy Delivery: “Here’s what will move the needle this week.”

## 3\. Visual Identity

- **Primary Font:** Inter (all headings & body)
- **Color Palette:**
  - Gold (Primary Action / Highlight): `#FFD700`
  - Blue (Accent): `#007BFF`
  - Green (Success): `#28A745`
  - Red (Danger): `#D32F2F`
  - Dark Text: `#1F1F1F`
  - Background: `#FAFAFA`
  - Border/Track: `#E5E5E5`

## 4\. UI Design Guidelines

- **Advisor as Presence, Not Character**
  - No illustrated avatar
  - Chat interface framed as “Alva’s Desk” with gold-accented top bar or left strip
  - Pulsing gold indicator when “thinking”
- **Content Blocks**
  - Use card-based layouts for responses, not endless text
  - Headings in gold, body in dark text
- **Microinteractions**
  - Smooth fade-in of text
  - Subtle shadow on active elements
  - Gold hover/active states for buttons

## 5\. UX Flow (First Contact)

1. **Landing Prompt:**
   - Headline: “Your personal marketing director is ready.”
   - Subhead: “Alva works with you 24/7 to build and execute a strategy tailored to your business.”
2. **Email Verification \- Welcome Message:**
   - “Great, you’re in. I just need a few quick details so I can get to know your brand.”
3. **Onboarding Cards (Name \- Brand Info \- Goals)**

## 6\. Differentiators

- **Not a Chatbot, a Director:** Copy always positions Alva as a decision-maker, not a Q\&A machine.
- **Custom Knowledge Base:** Trained specifically on the client’s inputs \+ marketing playbooks.
- **Clean, Minimal UI:** Zero gimmicks \- design feels intentional and premium.

## 7\. Usage Rules

- Never use overly playful emoji or slang unless quoting a campaign idea.
- Always explain recommendations in business terms that tie to ROI.
- Avoid filler like “As an AI…” \- focus on the role: “Here’s what I recommend…”
- Keep the gold accents consistent \- no variations in hue or saturation.

# Account Creation

### **Step 1: Minimal Friction Entry**

- **Single-field capture:** Just _email_.
- Large bold heading (Inter Bold, 22px, \#1F1F1F) \[Left justified\]
  - “Train Your New Marketing Director in Minutes”
- Subheadline (Inter Regular, 16px, \#1F1F1F) \[See note on Page 2.\]
  - “Answer a few quick questions and Alva works with you 24/7 to build a strategy tailored to your business. \- right now.”
- This step must feel like: _"Drop your email, and we'll get started building your plan right now."_

### **Step 2: Micro-Commitment Framing**

- Right after email:
  - **Welcome Screen / Card** \- clean, fullscreen, 1-2 sentences:
    - “Great, you’re in. I just need a few quick details so I can get to know your brand.”
  - Note under this (“26 cards • 5 minutes”)
  - **CTA Button:** “Let’s Go” \- starts the onboarding cards.

# ONBOARDING CARDS

Onboarding questions into 5 swipe-able clusters \- each one feels like a micro-deck of 4-6 cards.  
Each card is a clean, fullscreen moment:

## Global Style Section

This covers all repeating patterns:

- **Font**: Inter (Fallback: Helvetica, Arial)
- **Primary Color**: Gold (\#FFD700)
- **Secondary Color**: Blue (\#007BFF)
- **Accent**: Soft Cloud Gray (\#F0F0F0)
- **Text**: \#1F1F1F
- **Subtext**: \#6F6F6F
- **Component Types**:
  - Pill Select
  - Text Input
  - Multi-Select with Description
  - File Upload
  - Progress Bar
  - Navigation Buttons

1. **Section Header**
   - Brand Clarity • 1 of 6
   - **Progress Bar**: 6 segments, current step \= 2, gold fill (\#FFD700), light gray track (\#E5E5E5)
2. **Main Question**
   - Large bold heading (Inter Bold, 22px, \#1F1F1F) \[Left justified\]
     - EG: “What’s your brand vibe?”
   - Subheadline (Inter Regular, 16px, \#1F1F1F) \[See note on Page 2.\]
3. **Input Fields / Options**
   - Field Labels: Inter Regular, 14px, \#1F1F1F
   - Placeholders: Inter Regular, 14px, \#6F6F6F
   - Styles: 8px border radius, \#CCCCCC border, 14px padding
   - If pills: 24px border radius, default \= \#F0F0F0, selected \= gold (\#FFD700), text white
     - **Input field content:** EG: Pill select with text input triggered when other is selected.
       - Bold & Edgy
       - Fun & Playful
       - Modern & Innovative
       - Friendly & Approachable
       - Calm & Minimal
       - Elegant & Classic
       - Earthy & Natural
       - Retro & Nostalgic
       - Other
4. **Navigation Controls**
   - Back: Text link left, blue (\#007BFF)
   - Skip: Text link center, gray (\#6F6F6F)
   - Next: Gold button (\#FFD700) right, black text (\#1F1F1F), 8px radius

### CARD GROUPS

#### 1\. Brand Clarity (1/6) 6 cards

- **Page 1: “What’s your business name & what do you sell?” \[Open field\]**

Your name (text), Business name (text), Brief description of what you sell (text)  
**Section Header** Brand Clarity • 1 of 6, **Progress Bar**: 6 segments, current step \= 1  
**Visual Mockup:** [https://drive.google.com/file/d/1N40oYrsHArCeI1RAlJ4X6P8xFVyeR0gM/view?usp=sharing](https://drive.google.com/file/d/1N40oYrsHArCeI1RAlJ4X6P8xFVyeR0gM/view?usp=sharing)

- **Page 2: “What’s your brand vibe? \- Choose the best fit for your brand’s vibe. \[Can select multiple\]**

  - Bold & Edgy
  - Fun & Playful
  - Modern & Innovative
  - Friendly & Approachable
  - Calm & Minimal
  - Elegant & Classic
  - Earthy & Natural
  - Retro & Nostalgic
  - Other

  **Section Header** Brand Clarity • 1 of 6, **Progress Bar**: 6 segments, current step \= 2

  **NOTE: I’m thinking it would be best if the headlines were all left justified and the subheadlines proceeded from them (see Page 11\) \- in that case, the subheadlines would probably be the same font, just not bold.**

**Visual Mockup:** [https://drive.google.com/file/d/141pTZFo04TuoxEtnA3ZaEnLa6MsgO9tr/view?usp=drive_link](https://drive.google.com/file/d/141pTZFo04TuoxEtnA3ZaEnLa6MsgO9tr/view?usp=drive_link)

- **Page 3: “Who’s your dream customer?” \[Select avatar tags or “Describe them” text field can select multiple\]**

  - College Student (18-24)
    - Low budget, trend-aware, heavy on social media, impulse-friendly.
  - Young Professional (25-34)
    - Career-focused, curates image, shops online, values convenience.
  - New Parent (25-40)
    - Busy, practical, budget-aware, buys for home/kids.
  - Homeowner (30-50)
    - Values quality, durability, aesthetics \- buys for household.
  - Middle-Aged Professional (40-60)
    - Has disposable income, values reliability, slow to switch brands.
  - Retiree (60+)
    - Cares about service, clarity, comfort, and ease of use.
  - Teen / Gen Z (13-18)
    - Influenced by TikTok, visual culture, buys through mobile first.
  - Describe them

  **Section Header** Brand Clarity • 1 of 6, **Progress Bar**: 6 segments, current step \= 3

  **NOTE: These should actually be buttons like page 11 below, (with the selection like page 6\) but AI is stupid.....**

**Visual Mockup:** [https://drive.google.com/file/d/1wZc7Y-1H21LAh_VkEdduLOSoIE-RS415/view?usp=drive_link](https://drive.google.com/file/d/1wZc7Y-1H21LAh_VkEdduLOSoIE-RS415/view?usp=drive_link)

- **Page 4: “Which of the following best matches your business focus?”**

  - Ecommerce Sales
  - Local Service Bookings
  - Lead Generation
  - Content Monetization
  - Coaching or Consulting
  - Subscription Revenue
  - Event Promotion or Ticket Sales
  - App or Software Adoption
  - Brand Awareness
  - B2B Relationship Building
  - Customer Retention & Loyalty
  - Describe your unique solution

  **Section Header** Brand Clarity • 1 of 6, **Progress Bar**: 6 segments, current step \= 4

**Visual Mockup:** [https://drive.google.com/file/d/1GTBtLCMQOYVv1bBzKpqFJzkutFuwBjlK/view?usp=drive_link](https://drive.google.com/file/d/1GTBtLCMQOYVv1bBzKpqFJzkutFuwBjlK/view?usp=drive_link)

- **Page 5: “What makes you stand out?” \[Can choose multiple\]**

  - Better Quality
  - Faster Turnaround
  - Unique Design / Style
  - Personalized or Custom
  - Best Value for Price
  - Eco-Friendly / Ethical
  - Niche Expertise
  - Killer Customer Experience
  - Bold Branding / Story
  - Innovative Technology
  - Other

  **Section Header** Brand Clarity • 1 of 6, **Progress Bar**: 6 segments, current step \= 5

**Visual Mockup:** [https://drive.google.com/file/d/1pDPP6wJiaKcBEVGStKwF2K7tnw-mM3mI/view?usp=drive_link](https://drive.google.com/file/d/1pDPP6wJiaKcBEVGStKwF2K7tnw-mM3mI/view?usp=drive_link)

- **Page 6: “Do you have colors/fonts already?” \[Yes / No \- optional upload or hex input\]**

  - **Yes**
    - \- _\[Upload brand guide or Logo / Drop hex codes / Paste font names\]_
      - Upload file \[PDF brand guide, jpg, or png logo\]
      - Hex color input(s)
      - Font name(s) field
  - **No**
    - \- _\[Would you like help choosing?\]_
      - “Suggest for me later” button
      - Possible: Upload brand reference for suggestion.
      - Possible: “Any colors or styles you dislike?

  **Section Header** Brand Clarity • 1 of 6, **Progress Bar**: 6 segments, current step \= 6

**Visual Mockup:** [https://drive.google.com/file/d/10aPfp4TRqOm06cbNVhxz3z2KjQdtz06x/view?usp=drive_link](https://drive.google.com/file/d/10aPfp4TRqOm06cbNVhxz3z2KjQdtz06x/view?usp=drive_link)

#### 2\. Products & Offers (2/6) 4 cards

- **Page 7: “What do you sell?”**

  - **Products**
    - Apparel & Accessories
    - Beauty & Personal Care
    - Home & Lifestyle Products
    - Digital Products
    - Subscription Boxes
    - Handmade or Custom Goods
    - Food & Beverage
    - Event Merch or Promotional Products
    - Prints, Art & Stationery
    - Toys, Games & Collectibles
    - Tech & Gadgets
  - **Services**
    - Coaching or Consulting
    - Creative Services
    - Local or In-Person Services
    - Events or Experiences
    - Other

  **Section Header** Products & Offers • 2 of 6, **Progress Bar**: 4 segments, current step \= 1

**Visual Mockup:** [https://drive.google.com/file/d/1ZmQ3zJJ\_-pmhLKFkFDfVwnmd1ppbXnbJ/view?usp=drive_link](https://drive.google.com/file/d/1ZmQ3zJJ_-pmhLKFkFDfVwnmd1ppbXnbJ/view?usp=drive_link)

- **Page 8: “Toggle any special offer types you use:"**

  - Bundles / Kits
  - Custom Options
  - Upsells / Add-ons
  - Subscriptions / Recurring Orders
  - Volume Pricing / Bulk Discounts
  - Free Shipping over $X
  - Loyalty or Rewards Program
  - Other / Describe

  **Section Header** Products & Offers • 2 of 6, **Progress Bar**: 4 segments, current step \= 2

**Visual Mockup:** [https://drive.google.com/file/d/11p-\_J98n_r_y_NSHxTszrm5jsXtzGioL/view?usp=drive_link](https://drive.google.com/file/d/11p-_J98n_r_y_NSHxTszrm5jsXtzGioL/view?usp=drive_link)

- **Page 9: “Where do people buy from you?”**

  - Your Website or Other Online Store
  - Mobile App
  - DMs / Social Media
  - Etsy / Amazon / Marketplace
  - Brick & Mortar Storefront
  - In-Person Events / Pop-Ups / Craft Fairs
  - Manual Orders (Text / Email / Phone)
  - Other / Describe

  **Section Header** Products & Offers • 2 of 6, **Progress Bar**: 4 segments, current step \= 3

**Visual Mockup:** [https://drive.google.com/file/d/1l2tJCG2zyBQMJelK6ke05bUQ7DJofEl-/view?usp=drive_link](https://drive.google.com/file/d/1l2tJCG2zyBQMJelK6ke05bUQ7DJofEl-/view?usp=drive_link)

- **Page 10: “Do you run sales or seasonal promos?”**
  - Yes \- Regularly

_(Flash sales,_ clearance or ongoing sales, _product drops, sitewide promos)_

- Only Around Holidays or Seasons

_(Black Friday, Valentine’s, seasonal themes)_

- No \- I don’t run discounts or promos

  - _(Evergreen pricing or premium positioning)_
  - Not Yet \- But I'm open to it

  **Section Header** Products & Offers • 2 of 6, **Progress Bar**: 4 segments, current step \= 4

**Visual Mockup:** [https://drive.google.com/file/d/1V4BAn8ABf7cYn9N-HJynqrTpYO3ooCoB/view?usp=drive_link](https://drive.google.com/file/d/1V4BAn8ABf7cYn9N-HJynqrTpYO3ooCoB/view?usp=drive_link)

#### 3\. Content & Social (3/6) 6 cards

- **Page 11: “Where do you show up online? (Select all platforms where you regularly post)” \[Platform toggles\]**

  - Website or Shopify Store
  - Email List / Newsletter
  - Etsy / Amazon / Marketplace Profile
  - TikTok
  - Instagram
  - Facebook
  - Twitter (X)
  - Pinterest
  - YouTube or Podcast
  - LinkedIn
  - Other / Describe

  **Section Header** Content & Social • 3 of 6, **Progress Bar**: 6 segments, current step \= 1

**Visual Mockup:** [https://drive.google.com/file/d/1DS2quqCSOPP4uaAMu16Ze0I1vwAEDIk9/view?usp=drive_link](https://drive.google.com/file/d/1DS2quqCSOPP4uaAMu16Ze0I1vwAEDIk9/view?usp=drive_link)

- **Page 12: “What do you usually post?” \[Toggles\]**

  - Website Blog
  - Product Photos
  - Reels / Short-Form Videos
  - Behind the Scenes (BTS)
  - Live Videos or Q\&As
  - Selfies / Talking to Camera
  - Tips, Hacks, or Education
  - Memes / Relatable Posts
  - Other / Describe

  **Section Header** Content & Social • 3 of 6, **Progress Bar**: 6 segments, current step \= 2

**Visual Mockup:** [https://drive.google.com/file/d/113a5SPJ4IIf0OCDQtGKgsnIncElFT-ha/view?usp=drive_link](https://drive.google.com/file/d/113a5SPJ4IIf0OCDQtGKgsnIncElFT-ha/view?usp=drive_link)

- **Page 13: “What kind of content do you love making?”**

  - Photoshoots / Styled Product Shots
  - Short-Form Video (Reels / TikToks)
  - Behind-the-Scenes Process
  - Talking to Camera / Storytelling
  - Educational / Tips & How-To Content
  - Designing Graphics / Aesthetic Feeds
  - Writing / Captions / Long Posts
  - Community interaction/Live engagement
  - Audio content (podcasting)
  - Other / Describe Your Favorite

  **Section Header** Content & Social • 3 of 6, **Progress Bar**: 6 segments, current step \= 3

**Visual Mockup:** [https://drive.google.com/file/d/1BAnEKhNHEBemkkBn5FdQq3RsoEqPnNkM/view?usp=drive_link](https://drive.google.com/file/d/1BAnEKhNHEBemkkBn5FdQq3RsoEqPnNkM/view?usp=drive_link)

- **Page 14: “Do you show your face or voice?” \[Yes / No / Sometimes\]**

  - Yes
    - I regularly show up with my face or voice. I'm comfortable being visible and personal.
  - No
    - I prefer to stay behind the scenes. My content doesn’t feature my face or voice.
  - Sometimes
    - I do it occasionally \- depends on the content or how I'm feeling.

  **Section Header** Content & Social • 3 of 6, **Progress Bar**: 6 segments, current step \= 4

  **NOTE: Selection should look like page 6\.**

**Visual Mockup:** [https://drive.google.com/file/d/1q0kTTI4hEf8qLUnXMO8TdOMa62evKDGL/view?usp=drive_link](https://drive.google.com/file/d/1q0kTTI4hEf8qLUnXMO8TdOMa62evKDGL/view?usp=drive_link)

- **Page 15: “Who are your main competitors?” \[Drop URLs\]**

  - Drop competitor URLs to give us some context on market alternatives.

  **Section Header** Content & Social • 3 of 6, **Progress Bar**: 6 segments, current step \= 5

**Visual Mockup:** [https://drive.google.com/file/d/1xliFoZq23JeMvYBMh8EADinxvMMtg9tZ/view?usp=drive_link](https://drive.google.com/file/d/1xliFoZq23JeMvYBMh8EADinxvMMtg9tZ/view?usp=drive_link)

- **Page 16: “Any accounts you admire or want to vibe-match?" \[Open field (optional)\]**

  - Prompt Copy in the open field: "Drop any links to websites, Instagram, TikTok, or brand accounts you love the vibe of aesthetic, voice, energy, or style."

  **Section Header** Content & Social • 3 of 6, **Progress Bar**: 6 segments, current step \= 6

**Visual Mockup:** [https://drive.google.com/file/d/1dQ4USR7sPFsGZ35yEIYaXUsF1n0j51n1/view?usp=drive_link](https://drive.google.com/file/d/1dQ4USR7sPFsGZ35yEIYaXUsF1n0j51n1/view?usp=drive_link)

#### 4\. Goals & Growth (4/6) 5 cards

- **Page 17: “What are your top 3 marketing goals?”**

  - **(Select up to 3\)**
    - Increase Sales / Revenue
    - Grow My Audience
    - Build Brand Awareness
    - Boost Engagement
    - Launch a Product or Offer
    - Automate My Marketing
    - Get Consistent With Content
    - Build Trust / Authority
    - Test and Learn What Works
    - Other / Describe

  **Section Header** Goals & Growth • 5 of 6, **Progress Bar**: 5 segments, current step \= 1

  **NOTE: These should actually be buttons like the slides 11 below, (with the selection like page 7\) but AI is stupid.....**

**Visual Mockup:** [https://drive.google.com/file/d/1G0QnvNDGd68rjtIEHg-Xnrr8GVzmpSuT/view?usp=drive_link](https://drive.google.com/file/d/1G0QnvNDGd68rjtIEHg-Xnrr8GVzmpSuT/view?usp=drive_link)

- **Page 18: “Are you growing online, in person, or both?” \[Select one\]**

  - Online
    - I’m focused on growing through digital channels \- social media, email, ads, ecommerce.
  - In Person
    - I grow through events, markets, local retail, or face-to-face sales.
  - Both
    - I’m actively growing in both areas and want a strategy that connects them.

  **Section Header** Goals & Growth • 5 of 6, **Progress Bar**: 5 segments, current step \= 2

**Visual Mockup:** [https://drive.google.com/file/d/1_TvtAA1XZGqQH9uvfuI2JESTVdu-17H7/view?usp=drive_link](https://drive.google.com/file/d/1_TvtAA1XZGqQH9uvfuI2JESTVdu-17H7/view?usp=drive_link)

- **Page 19: “Trying to automate anything?” \[Yes / No \- with optional selections if Yes\]**

  - **Yes**
    - _Select what you’re trying to automate:_
      - Email campaigns or follow-ups
      - DMs / Lead replies
      - Shopify or order flows
      - Social media scheduling
      - Customer onboarding / post-purchase
      - Ad campaigns optimization
      - Other (open field)
  - **No**
    - If no, then prompt: "Not yet? That’s fine. But if you had a magic wand, what’s the one thing in marketing or admin you’d stop doing manually?"

  **Section Header** Goals & Growth • 5 of 6, **Progress Bar**: 5 segments, current step \= 3

**Visual Mockup:** [https://drive.google.com/file/d/1htWXzfv3yXIFL75K_YuHJtZJwDBuw-bI/view?usp=drive_link](https://drive.google.com/file/d/1htWXzfv3yXIFL75K_YuHJtZJwDBuw-bI/view?usp=drive_link)

- **Page 20: “What’s worked well in the past?” \[Select past wins\]**

  - Instagram posts or reels got strong engagement
  - TikTok video went semi-viral or brought sales
  - Pop-ups, fairs, or events drove real sales
  - Email campaigns or newsletters converted
  - Paid ads resulted in sales/leads
  - Collaborations or shoutouts brought in new customers
  - Giveaways, games, or promos sparked activity
  - Word of mouth or referrals helped you grow
  - My aesthetic / brand look really resonated
  - Other

  **Section Header** Goals & Growth • 5 of 6, **Progress Bar**: 5 segments, current step \= 4

**Visual Mockup:** [https://drive.google.com/file/d/1-hA5bNU869SAKU1iW9eKZ-vKqyLDpltm/view?usp=drive_link](https://drive.google.com/file/d/1-hA5bNU869SAKU1iW9eKZ-vKqyLDpltm/view?usp=drive_link)

- **Page 21: “What flopped or felt like a waste?”**

  - Prompt: "Anything that you tried that didn’t work? Something you spent time or money on and it just didn’t click."

  **Section Header** Goals & Growth • 5 of 6, **Progress Bar**: 5 segments, current step \= 5

**Visual Mockup:** [https://drive.google.com/file/d/1Vh-8E7PzEBiD9BMSVfi6HGGYO2Tr1Vhp/view?usp=drive_link](https://drive.google.com/file/d/1Vh-8E7PzEBiD9BMSVfi6HGGYO2Tr1Vhp/view?usp=drive_link)

#### 5\. Constraints & Tools (5/6) 6 cards

- **Page 22: “How much time can you spend on marketing each week?” \[Slider\]**

  - Slider Range: 0-20+ hours
    - 1 \- “Bare Minimum“ Just checking socials, maybe a post here or there
    - 5 \- “Light Touch“ Occasional posts, small promos, light engagement
    - 10 \- “Serious Effort“ Multi-channel, email, content, promos
    - 20+ \- “Full-Time Energy“ Daily content, strategy, testing, scaling

  **Section Header** Constraints & Tools • 6 of 6, **Progress Bar**: 6 segments, current step \= 1

  **NOTE: Slider style on page 23 looks better, but the slider should be on top under the headline and the options should highlight yellow like page 6 as the slider is moved.**

**Visual Mockup:** [https://drive.google.com/file/d/1w-vuho1ZKGQzWlRyfpJMqPK5-nby6yDu/view?usp=drive_link](https://drive.google.com/file/d/1w-vuho1ZKGQzWlRyfpJMqPK5-nby6yDu/view?usp=drive_link)

- **Page 23: Do you have a budget for marketing or ads? \[Slider\]**

  - None” \- “I’m working with $0”
  - “Minimal” \- “\<$100/month”
  - “Some” \- “$100-500”
  - “Significant” \- “$500+”
    - If more than none, prompt: “How much do you currently spend on marketing per month (approximately)?”

  **Section Header** Constraints & Tools • 6 of 6, **Progress Bar**: 6 segments, current step \= 2

  **NOTE: The Slider should be on top under the headline and the options should highlight yellow like page 6 as the slider is moved.**

**Visual Mockup:** [https://drive.google.com/file/d/1P51elCwqJiA-38WgEgK7x7jy66USjiEz/view?usp=drive_link](https://drive.google.com/file/d/1P51elCwqJiA-38WgEgK7x7jy66USjiEz/view?usp=drive_link)

- **Page 24: “Do you have a website, CRM, or email list set up?”**

  - Website Checkbox
  - CRM Checkbox
  - Email List Checkbox
  - None Checkbox

  **Section Header** Constraints & Tools • 6 of 6, **Progress Bar**: 6 segments, current step \= 3

**Visual Mockup:** [https://drive.google.com/file/d/1MOkPMXYRa3FBwmwfwMhsIFdZdoNp5QcE/view?usp=drive_link](https://drive.google.com/file/d/1MOkPMXYRa3FBwmwfwMhsIFdZdoNp5QcE/view?usp=drive_link)

- **Page 25: “Any hard no’s for your brand?”**

  - Prompt: “Any topics, language, types of content, styles, tactics or values you absolutely want to avoid?”

  **Section Header** Constraints & Tools • 6 of 6, **Progress Bar**: 6 segments, current step \= 4

**Visual Mockup:** [https://drive.google.com/file/d/11TXVYWF033_zAs88PukgJ6hE5VY3qf1U/view?usp=drive_link](https://drive.google.com/file/d/11TXVYWF033_zAs88PukgJ6hE5VY3qf1U/view?usp=drive_link)

- **Page 26: “Anything else you’d like to share?”**

  - Prompt: ‘Did we miss any information that may be crucial to understanding your business?”

  **Section Header** Constraints & Tools • 6 of 6, **Progress Bar**: 6 segments, current step \= 5

**Visual Mockup:**  
[https://drive.google.com/file/d/1cYVHBCjktVK8_npoaEFV1uh2HL1p1TMH/view?usp=drive_link](https://drive.google.com/file/d/1cYVHBCjktVK8_npoaEFV1uh2HL1p1TMH/view?usp=drive_link)

# Immediate Pay-Off Following Onboarding

### **1\. Loading / Anticipation Phase (2–3 sec)**

- **Headline:** “Crunching your answers…”
- Animated dots or progress bar (gold accent)
- Subtext: “Building your custom marketing plan…”
- This buys time to dynamically assemble their recap data and feels like work is happening _for them_.

### **2\. Summary Preview (Styled like a Deck)**

**Headline:**

“Here’s What We Know About Your Brand”

**Subheadline:**

“We’ll use this to craft your tailored marketing plan.”

**Content Layout:**

- **Slide-style cards** stacked vertically with **bold section headers**:
  1. **Brand at a Glance** – Business name, vibe, colors/fonts, dislikes
  2. **Your Dream Customers** – Segments \+ key traits
  3. **What You Sell** – Products/services \+ where you sell
  4. **Your Goals** – Top 2–3 marketing priorities
  5. **Tools & Limits** – Team size, time, budget
  6. **Brand Boundaries** – No-go content/tone rules

**Visual styling:**

- Each “section” in a light gray (\#F0F0F0) rounded container
- Section header in gold (\#FFD700), Inter Bold, 16px
- Content in dark text (\#1F1F1F) with a bit of iconography if possible

### **3\. CTA to Full Plan**

- **Headline:** “Your Marketing Plan Is Ready”
- Subtext: “Get your step-by-step strategy based on everything above.”
- **Primary Button:** “See My Plan” (gold background, black text)
- **Secondary link:** “Edit my answers” (blue text) — lets them jump back if they spot an error

### **4\. Step 5 \- Verification Hook**

If you didn’t verify earlier:

- When they click “See My Plan,”  
   → show a **lightbox modal** or **inline step**:  
   “Save your plan & get ongoing advice — verify your email.”
  - 1-click link sent to their inbox
  - Option: “Continue without saving” (but position secondary)

**Instant Access to Chat Interface**

- First message: “Alright \- I’ve got the basics. Where would you like to start today?”

# Client Information Reference Schema JSON **(NEED TO ADD A SECTION FOR EXTRA CLIENT NOTES OR FEEDBACK)**

```json
{
  "user_profile": {
    "user_name": "",
    "business_name": "",
    "description": "",
    "website": ""
  },
  "brand_identity": {
    "vibe_tags": [],
    "primary_colors": [],
    "fonts": [],
    "dislikes": [],
    "differentiators": []
  },
  "target_audience": {
    "personas": [],
    "custom_description": ""
  },
  "business_model": {
    "focus": [],
    "products": [],
    "offers": [],
    "sales_channels": [],
    "run_promos": ""
  },
  "content_presence": {
    "platforms": [],
    "post_types": [],
    "content_preferences": [],
    "shows_face_or_voice": "",
    "competitors": [],
    "vibe_inspo": []
  },
  "marketing_goals": {
    "top_goals": [],
    "growth_mode": "",
    "automation_goals": [],
    "past_successes": [],
    "past_failures": ""
  },
  "constraints": {
    "weekly_marketing_time_hours": "",
    "budget_level": "",
    "monthly_ad_budget": "",
    "tech_stack": [],
    "team_type": "",
    "brand_nos": [],
    "additional_notes": ""
  }
}
```

# Master Marketing Plan JSON

```json
{
  "plan": {
    "client_id": "",
    "window_start": "",
    "window_end": "",
    "weekly_capacity_hours": "",
    "timezone": ""
  },
  "tasks": [
    {
      "id": "",
      "title": "",
      "desc": "",
      "channel": "",
      "effort": "",
      "estimated_minutes": "",
      "due_at": "",
      "status": "",
      "tags": [],
      "priority": "",
      "source": {
        "module": "",
        "module_task_id": ""
      },
      "external_refs": {
        "gcal_event_id": "",
        "clickup_task_id": ""
      }
    }
  ],
  "meta": {
    "generated_at": "",
    "governance_version": "",
    "resolution_log": [
      {
        "type": "",
        "week": "",
        "count": ""
      }
    ]
  }
}
```

# PPC Marketing Plan JSON

```json
{
  "plan_type": "ppc",
  "version": "1.0",
  "duration": "12 months",
  "review_intervals": ["Monthly", "Quarterly"],
  "revision_logic": "Update this structure based on client constraints, wins, losses, or channel shifts.",
  "client_data_linked": true,
  "phases": [
    {
      "phase": "Phase 1",
      "label": "Foundation & Strategy",
      "months": [1],
      "objectives": [
        "Define business goals and KPIs",
        "Audit competitors",
        "Determine platforms and campaigns",
        "Set tracking and analytics infrastructure"
      ],
      "tasks": [
        "Set testing vs. scale budget",
        "Choose platforms (Google, Meta, YouTube, etc.)",
        "Install Google Tag Manager and GA4",
        "Configure conversion tracking"
      ]
    },
    {
      "phase": "Phase 2",
      "label": "Setup & Pre-Launch",
      "months": [2],
      "objectives": [
        "Build PPC campaigns and ad groups",
        "Create ad variants",
        "Optimize landing pages",
        "QA and test full funnel"
      ],
      "tasks": [
        "Create campaign/ad group structure",
        "Upload creative and assign to LPs",
        "Verify pixel/conversion firing",
        "Set up reporting dashboards"
      ]
    },
    {
      "phase": "Phase 3",
      "label": "Launch & Early Learning",
      "months": [3, 4],
      "objectives": [
        "Launch campaigns with conservative budgets",
        "Gather baseline performance data",
        "Begin early optimizations"
      ],
      "tasks": ["Monitor delivery and disapprovals", "Pause low performers", "Start weekly reporting (CTR, CPC, ROAS)"]
    },
    {
      "phase": "Phase 4",
      "label": "Performance Optimization",
      "months": [5, 6, 7],
      "objectives": ["Scale best-performing elements", "Deepen funnel and remarketing", "A/B and multivariate testing"],
      "tasks": ["Test bid strategies", "Build email or CRM integrations", "Expand keyword sets or geos"]
    },
    {
      "phase": "Phase 5",
      "label": "Expansion & Full Funnel",
      "months": [8, 9, 10],
      "objectives": ["Add upper funnel campaigns", "Test new ad formats", "Apply smart automation"],
      "tasks": [
        "Launch YouTube and Meta Awareness",
        "Evaluate GA4 vs. platform reporting",
        "Reassign budget based on journey"
      ]
    },
    {
      "phase": "Phase 6",
      "label": "Peak Performance & Seasonal Strategy",
      "months": [11, 12],
      "objectives": ["Maximize seasonal ROI", "Re-engage past customers", "Plan next-year PPC roadmap"],
      "tasks": ["Launch holiday offers", "Build win-back campaigns", "Final performance review"]
    }
  ],
  "sample_quarters": [
    {
      "name": "Q1 - Validation & Testing",
      "goals": ["Capture branded search", "Retarget warm traffic", "Test cold audiences"],
      "campaigns": [
        {
          "name": "Branded Search",
          "start_month": 1,
          "end_month": 3,
          "platform": "Google Ads",
          "budget_pct": 40,
          "bidding_strategy": "Target CPA",
          "kpis": {
            "CPA": 25,
            "ROAS": 3.5
          }
        },
        {
          "name": "Display Retargeting",
          "start_month": 1,
          "end_month": 3,
          "platform": "Google Display Network",
          "budget_pct": 30,
          "bidding_strategy": "Target ROAS",
          "kpis": {
            "ROAS": 4,
            "Frequency Cap": 3
          }
        },
        {
          "name": "Cold Interest Testing",
          "start_month": 2,
          "end_month": 3,
          "platform": "Meta Ads",
          "budget_pct": 30,
          "bidding_strategy": "Maximize Clicks",
          "kpis": {
            "CTR": 2.5
          }
        }
      ]
    }
  ],
  "budget": {
    "monthly_total": 3000,
    "allocation_basis": "percentage",
    "example_allocation": {
      "Search - High Intent": 1500,
      "Retargeting - Branded": 800,
      "Awareness - Cold Lookalike": 700
    }
  },
  "generic_campaigns": [
    {
      "name": "Search - High Intent",
      "goal": "Capture bottom-funnel buyers",
      "audience": ["In-market searchers", "Custom intent keywords"],
      "ad_formats": ["Responsive Search Ads"],
      "budget": 1500,
      "bidding_strategy": "Maximize conversions (Target CPA)",
      "kpis": {
        "cpa_goal": 25,
        "ctr_goal": 5,
        "conversion_rate_goal": 10
      },
      "messaging": ["Ready to solve [pain point]?", "Get [benefit] now -- no contract required."],
      "timeline": "Month 1-3",
      "watchouts": ["Optimize negative keywords weekly"]
    },
    {
      "name": "Retargeting - Branded",
      "goal": "Re-engage brand-aware audiences",
      "audience": ["Website visitors", "Social engagers"],
      "ad_formats": ["Image Ads", "Carousel", "Video"],
      "budget": 800,
      "bidding_strategy": "Target ROAS",
      "kpis": {
        "roas_goal": 4,
        "frequency_cap": 3,
        "cpm_goal": 10
      },
      "messaging": ["Still thinking it over? We kept your offer ready."],
      "timeline": "Always-on",
      "watchouts": ["Rotate creatives monthly"]
    }
  ]
}
```

# PPC LLM Prompt JSON

```json
{
  "module": "PPC Plan Generator",
  "version": "1.0",
  "type": "strategy*adaptation",
  "input_schema": ["client-profile.json", "ppc.json"],
  "output_schema": "_business-name*_ppc.json",
  "description": "Tailors a 12-month PPC strategy based on client profile and context.",
  "instructions": {
    "role": "You are a senior marketing strategist for small business PPC.",
    "task": "Update the 12-month PPC plan using the client profile and base plan provided.",
    "use_client_data": [
      "marketing_goals (especially past_failures and past_successes)",
      "monthly_ad_budget and weekly_marketing_time_hours",
      "team_type and business_model",
      "product type and average order value (if available)",
      "target_audience demographics and platform usage",
      "content_presence strengths and weaknesses"
    ],
    "strategic_directives": [
      "Scale campaign budget and complexity based on monthly_ad_budget and weekly_marketing_time_hours",
      "Simplify campaign structure for solopreneurs (team_type: 'Just Me') -- no more than 2 active campaigns",
      "Adjust or remove platforms based on past_failures; favor those aligned with content_preferences and audience",
      "Eliminate channels not supported by tech stack or content ability (e.g., no video = no YouTube)",
      "Lean toward search/retargeting if product is niche or brand-aware; lean social if product is visual/lifestyle",
      "Prioritize ROAS bidding if budget is tight and AOV is high",
      "Reference run_promos to decide if seasonal bursts make sense",
      "Add a revision_notes field at the bottom summarizing major changes and why"
    ],
    "format": "Return the updated PPC JSON with the exact same structure. Do not include any commentary outside the JSON."
  },
  "notes": "This module adapts the PPC plan to the client's current business context, constraints, and growth trajectory -- not just budget adjustments."
}
```

# Blog Marketing Plan JSON

```json
{
  "meta": {
    "name": "blog_workflow_schema",
    "version": "1.0.0",
    "description": "Deterministic JSON workflow to go from client profile + RankMath audit + notable events to published, SEO-optimized blog posts.",
    "author": "Alva System"
  },
  "inputs": {
    "client_profile": {
      "type": "object",
      "required": true,
      "ref": "client-info.json"
    },
    "base_prompt": {
      "type": "object",
      "required": true,
      "ref": "blog_prompt_module"
    },
    "seo_requirements": {
      "type": "object",
      "required": true,
      "ref": "rankmath_guidelines"
    }
  },
  "controls": {
    "months_to_plan": {
      "type": "integer",
      "enum": [1, 2, 3, 6, 12],
      "default": 3
    },
    "events_per_month": {
      "type": "integer",
      "minimum": 3,
      "maximum": 5,
      "default": 4
    },
    "max_posts_per_month": {
      "type": "integer",
      "minimum": 2,
      "maximum": 8,
      "default": 4
    },
    "tone": {
      "type": "string",
      "enum": ["Professional", "Conversational", "Authoritative", "Playful"],
      "default": "Professional"
    },
    "reading_level": {
      "type": "string",
      "enum": ["Grade 7-8", "Grade 9-10", "College"],
      "default": "Grade 9-10"
    },
    "deterministic": {
      "type": "boolean",
      "default": true
    }
  },
  "derived_constraints": {
    "seo_rules": {
      "single_h1": true,
      "require_focus_keyword": true,
      "require_image_alt": true,
      "opengraph_required": true,
      "site_tagline_present": true,
      "target_response_time_s": 0.8,
      "max_page_requests": 80
    },
    "interlinking_rules": {
      "min_internal_links_per_post": 3,
      "min_external_links_per_post": 1,
      "link_to_series_pages": true
    }
  },
  "workflow": [
    {
      "id": "W1_collect_inputs",
      "type": "ingest",
      "outputs": ["client_profile", "base_prompt", "seo_requirements"],
      "notes": "Load JSON objects and normalize field names."
    },
    {
      "id": "W2_apply_seo_rules",
      "type": "transform",
      "inputs": ["seo_requirements"],
      "outputs": ["seo_checklist"],
      "logic": "Inject RankMath '100/100' best practices as a required ruleset, even if no plugin audit is available.",
      "determinism": "Pure function; fixed ruleset"
    },
    {
      "id": "W3_generate_monthly_events",
      "type": "generate",
      "inputs": ["client_profile"],
      "outputs": ["monthly_events"],
      "llm_module": "events_finder_v1",
      "constraints": {
        "events_per_month": {
          "min": 3,
          "max": 5
        }
      },
      "notes": "Use industry/seasonality derived from client profile to produce events per month (no PPC dependency)."
    },
    {
      "id": "W4_map_events_to_topics",
      "type": "map",
      "inputs": ["monthly_events", "client_profile", "seo_checklist"],
      "outputs": ["topic_map"],
      "logic": "For each event, produce 1-2 topic angles tailored to personas, product strengths, and SEO gaps."
    },
    {
      "id": "W5_content_briefs",
      "type": "generate",
      "inputs": ["topic_map", "base_prompt"],
      "outputs": ["briefs"],
      "llm_module": "brief_generator_v1",
      "determinism": "JSON only; validated against 'brief_schema'."
    },
    {
      "id": "W6_outlines",
      "type": "generate",
      "inputs": ["briefs"],
      "outputs": ["outlines"],
      "llm_module": "outline_generator_v1",
      "determinism": "JSON only; validated against 'outline_schema'."
    },
    {
      "id": "W7_drafts",
      "type": "generate",
      "inputs": ["outlines", "seo_checklist"],
      "outputs": ["drafts"],
      "llm_module": "draft_writer_v1",
      "post_processing": ["apply_onpage_requirements"]
    },
    {
      "id": "W8_onpage_requirements",
      "type": "validate_fix",
      "inputs": ["drafts", "seo_checklist"],
      "outputs": ["drafts_seo_passed"],
      "logic": "Enforce single H1, focus keyword in title + first 100 words + slug, image ALT present, OG/Twitter tags list, schema.org Article payload."
    },
    {
      "id": "W9_interlinking_plan",
      "type": "generate",
      "inputs": ["drafts_seo_passed"],
      "outputs": ["interlinking_matrix"],
      "logic": "Create per-post internal link targets and external references; ensure series/category pages are linked."
    },
    {
      "id": "W10_publish_schedule",
      "type": "schedule",
      "inputs": ["briefs"],
      "outputs": ["calendar"],
      "rules": {
        "cadence_per_week": {
          "enum": [1, 2, 3],
          "default": 1
        },
        "day_of_week_pref": {
          "enum": ["Mon", "Tue", "Wed", "Thu", "Fri"],
          "default": "Tue"
        }
      }
    },
    {
      "id": "W11_analytics_tags",
      "type": "emit",
      "outputs": ["ga4_events"],
      "logic": "Emit GA4 event names and parameters for blog engagement (scroll, time_on_page, CTA clicks)."
    },
    {
      "id": "W12_revision_notes",
      "type": "summarize",
      "inputs": ["briefs", "drafts_seo_passed", "interlinking_matrix"],
      "outputs": ["audit_trail"],
      "logic": "Explain choices, what gaps were addressed, and mapping to PPC funnel stages."
    }
  ],
  "schemas": {
    "event_schema": {
      "month": {
        "type": "string",
        "pattern": "^[0-9]{4}-(0[1-9]|1[0-2])$"
      },
      "event_name": {
        "type": "string"
      },
      "event_type": {
        "type": "string",
        "enum": ["seasonal", "industry", "promo", "launch", "holiday"]
      },
      "event_window": {
        "type": "string"
      },
      "priority": {
        "type": "integer",
        "minimum": 1,
        "maximum": 3
      }
    },
    "topic_map_item": {
      "event_name": {
        "type": "string"
      },
      "topics": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "minItems": 1,
        "maxItems": 2
      },
      "target_persona": {
        "type": "string"
      },
      "funnel_stage": {
        "type": "string",
        "enum": ["Awareness", "Consideration", "Decision"]
      },
      "primary_keyword": {
        "type": "string"
      },
      "secondary_keywords": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "maxItems": 5
      }
    },
    "brief_schema": {
      "post_id": {
        "type": "string"
      },
      "title": {
        "type": "string"
      },
      "angle": {
        "type": "string"
      },
      "target_persona": {
        "type": "string"
      },
      "search_intent": {
        "type": "string",
        "enum": ["Informational", "Commercial", "Transactional", "Navigational"]
      },
      "primary_keyword": {
        "type": "string"
      },
      "semantic_terms": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "maxItems": 12
      },
      "cta": {
        "type": "string"
      },
      "assets_needed": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "slug": {
        "type": "string"
      }
    },
    "outline_schema": {
      "post_id": {
        "type": "string"
      },
      "h1": {
        "type": "string"
      },
      "h2": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "h3": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "faq": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "maxItems": 5
      }
    },
    "draft_schema": {
      "post_id": {
        "type": "string"
      },
      "title": {
        "type": "string"
      },
      "h1": {
        "type": "string"
      },
      "sections": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "heading": {
              "type": "string"
            },
            "body_markdown": {
              "type": "string"
            }
          }
        }
      },
      "images": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "alt": {
              "type": "string"
            },
            "caption": {
              "type": "string"
            }
          }
        }
      },
      "metadata": {
        "type": "object",
        "properties": {
          "primary_keyword": {
            "type": "string"
          },
          "secondary_keywords": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "og_title": {
            "type": "string"
          },
          "og_description": {
            "type": "string"
          },
          "schema_article": {
            "type": "object"
          }
        }
      }
    },
    "seo_requirements": {
      "single_h1": {
        "type": "boolean"
      },
      "focus_keyword_in_title": {
        "type": "boolean"
      },
      "focus_keyword_in_first_100_words": {
        "type": "boolean"
      },
      "focus_keyword_in_meta": {
        "type": "boolean"
      },
      "image_alt_required": {
        "type": "boolean"
      },
      "opengraph_required": {
        "type": "boolean"
      },
      "schema_required": {
        "type": "boolean"
      },
      "site_tagline_required": {
        "type": "boolean"
      },
      "internal_links_min": {
        "type": "integer"
      },
      "external_links_min": {
        "type": "integer"
      },
      "response_time_s_max": {
        "type": "number"
      },
      "page_requests_max": {
        "type": "integer"
      }
    }
  },
  "llm_modules": {
    "events_finder_v1": {
      "role": "You are an editorial planner.",
      "prompt": "Using client_profile and capacity controls, output 3-5 events per month for the next N months. JSON only, match event_schema."
    },
    "brief_generator_v1": {
      "role": "You are an SEO content strategist.",
      "prompt": "For each topic in topic_map, create a brief (brief_schema). Ensure the primary_keyword aligns with personas and the seo_checklist requirements."
    },
    "outline_generator_v1": {
      "role": "You are a managing editor.",
      "prompt": "Convert each brief into a clean outline (outline_schema). Enforce one H1 per post."
    },
    "draft_writer_v1": {
      "role": "You are a senior copywriter.",
      "prompt": "Write the article from the outline into draft_schema. Include internal link placeholders like [[INTERNAL:slug]] and ensure image ALT text is descriptive."
    }
  },
  "outputs": {
    "monthly_events": {
      "type": "array",
      "items_ref": "event_schema"
    },
    "topic_map": {
      "type": "array",
      "items_ref": "topic_map_item"
    },
    "briefs": {
      "type": "array",
      "items_ref": "brief_schema"
    },
    "outlines": {
      "type": "array",
      "items_ref": "outline_schema"
    },
    "drafts": {
      "type": "array",
      "items_ref": "draft_schema"
    },
    "interlinking_matrix": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "calendar": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "ga4_events": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "audit_trail": {
      "type": "string"
    }
  }
}
```

# Blog LLM Prompt JSON

# Blog LLM Prompt JSON

"meta": {
"filename": "blog_plan_generator_v1.json",
"version": "1.0",
"created_at": "2025-08-28T00:00:00Z",
"last_modified": "2025-08-28T00:00:00Z",
"author": "Alva System",
"category": "content_plan_generator",
"tags": [
"blog",
"marketing",
"strategy",
"json_prompt",
"prompt_module"
],
"description": "Alva module for tailoring a 3-12 month blog content plan based on client profile and simplified SEO requirements."
},
"module": {
"name": "Blog Plan Generator",
"type": "strategy_adaptation",
"purpose": "Generate a customized blog content plan using client profile data and simplified SEO rules.",
"audience": "Solo founders, small businesses, handmade sellers, service providers, and early-stage ecommerce brands."
},
"inputs": {
"client_profile_schema": {
"required": true,
"format": "JSON",
"description": "Client profile including brand, business model, goals, audience, content presence, and constraints.",
"fields_used": [
"marketing_goals.top_goals",
"business_model.products",
"business_model.offers",
"business_model.run_promos",
"target_audience.personas",
"target_audience.custom_description",
"content_presence.platforms",
"content_presence.content_preferences",
"constraints.weekly_marketing_time_hours",
"constraints.team_type"
]
},
"base_blog_plan_schema": {
"required": true,
"format": "JSON",
"description": "A generic blog plan structure to be modified in place (events, topics, briefs, outlines, drafts, calendar)."
},
"seo_requirements": {
"required": true,
"format": "JSON",
"description": "Simplified SEO checklist aligned with Rank Math guidance.",
"defaults": {
"focus_keyword_in_title": true,
"focus_keyword_in_first_100_words": true,
"focus_keyword_in_meta": true,
"image_alt_required": true,
"internal_links_min": 3,
"external_links_min": 1
}
}
},
"logic": {
"role": "You are a senior content strategist for small business blogs.",
"goal": "Update the base blog plan using heuristics derived from the client profile and simplified SEO requirements.",
"directives": [
{
"id": "D01",
"directive": "Scale publishing cadence and depth based on weekly_marketing_time_hours and team_type.",
"note": "Limit to sustainable post frequency if resources are constrained."
},
{
"id": "D02",
"directive": "Prioritize broad, relevant keyword clusters over hyper-niche ones.",
"note": "Focus on topics that strengthen site-wide authority."
},
{
"id": "D03",
"directive": "Each post must include at least one primary keyword, supporting semantic terms, and follow seo_requirements.",
"note": "Target score 80-90 in Rank Math, not 100."
},
{
"id": "D04",
"directive": "Strengthen internal linking: suggest 3-5 pages to link from and at least one outbound authority source per post.",
"note": "Supports site structure and external validation."
},
{
"id": "D05",
"directive": "Reference seasonal promos or offers from run_promos to align content timing.",
"note": "Helps tie posts into campaigns or launches."
},
{
"id": "D06",
"directive": "Add a 'revision_notes' field at the bottom of the final JSON explaining what was changed or prioritized and why.",
"note": "Provides an audit trail for transparency."
}
]
},
"output": {
"format": "JSON",
"structure": "Must match input base_blog_plan_schema structure exactly",
"notes": [
"Do not add extra commentary outside of the returned JSON.",
"Do not change field labels or hierarchy in the blog plan.",
"Append 'revision_notes' at the bottom with clear, brief explanation of changes made."
]
},
"examples": {
"client_context_example": "A handmade jewelry brand posting twice per month with a Gen Z audience on TikTok and Instagram.",
"adaptation_result_example": "Plan includes 2 posts per month, keyword clusters around 'custom jewelry', internal links to product pages, one outbound authority link per post, notes on cadence limits due to solopreneur constraints."
},
"notes": {
"reminder": "You're not just filling keywords. You are creating sustainable, keyword-rich, internally linked content tied to the client's offers and audience.",
"use_case": "This module can be reused for any business with a completed onboarding JSON profile and a standard base blog strategy template."
}
} |
| :---- |

# Governance Logic for Merging Modules into a unified Master JSON

# Governance Logic for Merging Modules into a unified Master JSON

Think of it as **three main steps**:

1. **Onboarding → Custom Plan**
   - You take the client’s info (`*client_info.json`)
   - Combine it with a generic `base_marketing_plan.json` template
   - Output a **scaled and tailored** `*custom_plan.json` for them.
2. **Custom Plan → Modules**
   - You feed the custom plan into each marketing module (PPC, Blog, Social, Email, etc.)
   - Each module outputs **tasks in the same shape** → `*modules.json`.
3. **Modules → Master Plan**
   - A **governance step** merges all tasks, removes duplicates, schedules them based on capacity, and assigns priorities.
   - Output is `*master.json` — **the single source the dashboard reads**.

## JSON Files

## JSON Files

- **`base_marketing_plan.json`** → Static “template” plan.
- **`custom_plan.json`** → Tailored version with right cadence, enabled channels, and priority seasons.
- **`modules.json`** → Just the task lists from each marketing module, without dates.
- **`master.json`** → Fully scheduled, deduped, capacity-checked master plan (what the UI actually uses).

### The Rules in Plain English

- **Cadence scaling** → If they have less time, fewer posts/tasks are assigned.
- **Budget gating** → PPC is only enabled if ad budget ≥ $300/mo.
- **Dates** → Plan covers the next 90 days, starting next Monday.
- **Task shape** → Every module’s tasks look identical in structure (makes merging easy).
- **Governance** does 3 things:
  1. **Dedupes** tasks with similar titles or same IDs.
  2. **Capacity caps** total weekly minutes based on `weekly_marketing_time_hours`.
  3. **Prioritizes** quick wins and seasonal launches so they appear first.

### The Output The UI Reads

The **dashboard** only ever touches `master.json` to show:

- **Quick Win** → Next small, high-impact task.
- **Next 3 Deadlines** → So they can see what’s coming up.
- **Streaks** → Number of consecutive weekdays they’ve completed a Quick Win.
- **Action Board** → Filterable list of all tasks by channel, status, and due date.

## Repo layout (MVP)

```
/alva (NX monorepo)
├── apps/
│   ├── api/                              # Fastify API Server
│   │   ├── src/
│   │   │   ├── services/
│   │   │   │   └── plan-generation/
│   │   │   │       ├── llm.service.ts
│   │   │   │       ├── normalize-ppc.service.ts
│   │   │   │       ├── ppc.generator.ts
│   │   │   │       └── governance.service.ts
│   │   │   └── routes/
│   │   │       └── plans.routes.ts
│   │   └── data/
│   │       ├── prompts/
│   │       │   └── ppc_prompt.json
│   │       ├── templates/
│   │       │   ├── base_marketing_plan.json
│   │       │   └── ppc_base.json
│   │       └── output/
│   │           ├── scent-sparkle_custom_plan.json
│   │           ├── scent-sparkle_modules.json
│   │           └── scent-sparkle_master.json
│   └── web/                              # Next.js Frontend
├── libs/
│   ├── shared-types/                     # TypeScript types
│   │   └── src/
│   │       ├── client-profile.types.ts
│   │       ├── marketing-plan.types.ts
│   │       └── ppc-plan.types.ts
│   └── validation/                       # Zod schemas
│       └── src/
│           └── schemas/
│               ├── client-info.schema.ts
│               ├── marketing-plan.schema.ts
│               └── ppc-plan.schema.ts
```

## Onboarding

```json
{
  "client_id": "scent-sparkle",
  "business_name": "Scent & Sparkle Freshies",
  "site": "https://ssfreshies.com",
  "timezone": "America/Los_Angeles",
  "team_type": "Just Me",
  "weekly_marketing_time_hours": 5,
  "monthly_ad_budget": 50,
  "growth_mode": "steady",
  "audience": {
    "personas": ["Teen/Gen Z", "New Parent"],
    "notes": "IG/TikTok heavy; video OK; no face on camera."
  },
  "content_presence": {
    "platforms": ["Instagram", "TikTok", "Email"],
    "constraints": ["No live video", "Limited editing time"]
  },
  "constraints": {
    "brand_nos": ["Neon colors"],
    "tech_stack": ["Shopify", "Mailchimp"],
    "past_failures": ["FB Ads scale"],
    "past_successes": ["IG Reels BTS", "Craft fair promos"]
  },
  "seasonality": ["Back-to-school", "Halloween", "BFCM", "Christmas"]
}
```

## Base Marketing Plan

```json
{
  "version": "1.0",
  "channels": ["Instagram", "TikTok", "Email"],
  "content_pillars": [
    { "name": "Behind the Scenes" },
    { "name": "Product Features" },
    { "name": "Lifestyle & Community" }
  ],
  "default_cadence": {
    "social_posts_per_week": 2,
    "emails_per_month": 2,
    "blogs_per_month": 1
  },
  "acquisition": {
    "lead_capture": ["Email sign-up", "Giveaways"],
    "discount_first_purchase": true
  },
  "measurement": {
    "weekly": ["engagement", "open_rate"],
    "monthly": ["sales_by_channel", "repeat_rate"]
  }
}
```

## Generate Custom Marketing Plan

```json
{
  "client_id": "scent-sparkle",
  "window": {
    "start": "2025-09-01",
    "end": "2025-11-30"
  },
  "cadence": {
    "social_posts_per_week": 2,
    "emails_per_month": 2,
    "blogs_per_month": 0
  },
  "channel_enables": {
    "Instagram": true,
    "TikTok": true,
    "Email": true,
    "Blog": false
  },
  "priority_seasons": ["Halloween", "BFCM", "Christmas"],
  "strategy_notes": [
    "No FB scale; focus IG/TikTok Reels.",
    "Weekly time cap=5h → keep tasks to <=75 min each; daily quick wins 15-20 min."
  ]
}
```

## Run Modules as add‑ons (after custom plan)

```json
{
  "module_key": "ppc",
  "version": "1.0",
  "tasks": [
    {
      "module_task_id": "ppc_001",
      "title": "Configure conversion tracking",
      "desc": "GTM + GA4; verify purchase event.",
      "channel": "ppc",
      "tags": ["setup", "evergreen"],
      "effort": 2, // 1=30m, 2=75m, 3=210m
      "suggested_week": 1, // relative to window.start
      "due_hint": "before_first_launch"
    },
    {
      "module_task_id": "ppc_002",
      "title": "Branded Search campaign build",
      "desc": "RSA x3; SKAGs minimized; neg lists.",
      "channel": "ppc",
      "tags": ["launch", "priority"],
      "effort": 3,
      "suggested_week": 2
    }
  ]
}
```

## Governance merge

```json
{
  "plan": {
    "client_id": "scent-sparkle",
    "window_start": "2025-09-01",
    "window_end": "2025-11-30",
    "weekly_capacity_hours": 5,
    "timezone": "America/Los_Angeles"
  },
  "tasks": [
    {
      "id": "tsk_f3d91a1b7c",
      "title": "Configure conversion tracking",
      "desc": "GTM + GA4; verify purchase event.",
      "channel": "ppc",
      "effort": 2,
      "estimated_minutes": 75,
      "due_at": "2025-09-09T17:00:00-07:00",
      "status": "planned",
      "tags": ["setup", "evergreen"],
      "priority": 2,
      "source": {
        "module": "ppc",
        "module_task_id": "ppc_001"
      },
      "external_refs": {
        "gcal_event_id": "",
        "clickup_task_id": ""
      }
    },
    {
      "id": "tsk_9b0e431c2a",
      "title": "Daily Quick Win: Record 20s BTS Reel",
      "desc": "Stitch close-up; CTA: bio link.",
      "channel": "social",
      "effort": 1,
      "estimated_minutes": 20,
      "due_at": "2025-09-02T17:00:00-07:00",
      "status": "planned",
      "tags": ["quick_win"],
      "priority": 1,
      "source": {
        "module": "social",
        "module_task_id": "soc_qw"
      },
      "external_refs": {
        "gcal_event_id": "",
        "clickup_task_id": ""
      }
    }
  ],
  "meta": {
    "generated_at": "2025-08-14T18:05:00-07:00",
    "governance_version": "v1.0.0",
    "resolution_log": [
      {
        "type": "defer_over_capacity",
        "week": "2025-09-08",
        "count": 1
      }
    ]
  }
}
```

## Governance rules:

- **Normalize**: ensure `channel ∈ {ppc,social,email,blog,seo,ops}`; `effort ∈ {1,2,3}` → minutes `{30,75,210}`.
- **IDs**: `id = sha1(client_id|module|module_task_id|title)[:10]`.
- **Scheduling**:
  - Place tasks by `suggested_week` relative to `window_start`.
  - Reserve **one Quick Win** (effort 1\) per weekday if available.
  - Enforce **weekly minutes cap** from `weekly_capacity_hours`; overflow pushes to next week.
  - Honor `due_hint` when present (e.g., `"before_first_launch"` → Week 2).
- **Deduplication**:
  - If titles are ≥0.7 similar **or** same `module_task_id`, keep **higher priority**, else shorter `estimated_minutes`.
- **Priority** (default 2): `quick_win=1`, `launch/seasonal=1`, `evergreen=3`.

## Frontend reads only

- **Dashboard**: Quick Win, next 3 deadlines, streaks (computed from `status` and dates).
- **Action Board**: Kanban of `tasks` with filters.
- **Bot**: answers “What’s next?” by reading the next `planned` task(s) by priority.

# Deterministic Prompt Templates for Plan Generation

## Action plan

1. **Wrap the modules in a strict pipeline (schema‑validated)**

The API server implements a plan generation pipeline with:

- `llm.service.ts` (orchestrates generate → validate → normalize)
- Zod schemas (`ppc-plan.schema.ts`) for runtime validation
- TypeScript types from `@alva/shared-types`
- JSON prompt templates: `ppc_prompt.json`, `ppc.json`, `planning-rules.json`, `tag_guide.json`
- Normalization service: `normalize-ppc.service.ts`
- Pipeline runner: `ppc.generator.ts`
- Version control via git tags and semver
- It validates outputs with Zod schemas. If validation fails, the pipeline throws an error.

2. **Ban free‑text output**

- LLM service uses OpenAI JSON mode (`response_format: { type: "json_object" }`), temperature=0, and strict system prompts
- Any non-JSON response causes the pipeline to fail
- Zod validation ensures structure matches expected schema

3. **Automate normalization**

- `normalize-ppc.service.ts` runs automatically after LLM generation
- Enforces tag standards, date alignment, and deterministic ordering
- Result is written to database and optionally exported to JSON

4. **Version and reproducibility**

- All prompts and templates are version-controlled in git
- Database stores plan generation metadata (prompt version, LLM model, timestamp)
- Git tags track releases: `v1.0.0`, etc.
- CI/CD ensures consistent builds across environments

## How to run it (commands)

```bash
# 1) Navigate to API server
cd apps/api

# 2) Set environment variables
export OPENAI_API_KEY=your_key_here

# 3) Generate a plan via API endpoint
curl -X POST http://localhost:3001/api/plans/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @client-profile.json

# Or run directly via CLI script
pnpm run generate:plan --client-id scent-sparkle --module ppc

# 4) Validate plan (runs automatically in pipeline)
pnpm run validate:plan ./data/output/scent-sparkle_ppc.json

# 5) Normalize plan (runs automatically after generation)
pnpm run normalize:plan ./data/output/scent-sparkle_ppc.json

# 6) Run full pipeline (generate + validate + normalize)
pnpm run pipeline:full --client-id scent-sparkle
```

Output files land in `./data/output/`.  
Hard truth: this is wiring, not theory. You need a real JSON‑only model call, strict schemas, and a normalizer that enforces your tag standard and ordering. Do it exactly like this.

## 1\) Implement LLM Plan Generation in TypeScript

Use JSON mode (a.k.a. structured outputs) so the model is _constrained_ to emit valid JSON. Temperature stays at 0 for determinism.

```typescript
// apps/api/src/services/plan-generation/llm.service.ts
import OpenAI from "openai";
import { readFile } from "fs/promises";
import type { ClientProfile, PPCPlan, PromptModule } from "@alva/shared-types";

/**
 * @description Generates a marketing plan using OpenAI with JSON mode
 *
 * @param promptPath - Path to prompt module JSON
 * @param basePlanPath - Path to base plan template
 * @param clientProfile - Client profile object
 * @returns Generated plan (validated)
 */
export async function generateWithLLM(
  promptPath: string,
  basePlanPath: string,
  clientProfile: ClientProfile
): Promise<PPCPlan> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Load input files
  const prompt = JSON.parse(await readFile(promptPath, "utf-8"));
  const basePlan = JSON.parse(await readFile(basePlanPath, "utf-8"));

  // Build the messages - keep it minimal + explicit
  const systemMsg = {
    role: "system" as const,
    content: "You are a senior PPC strategist. Return ONLY valid JSON that exactly matches the base plan's structure.",
  };

  const userMsg = {
    role: "user" as const,
    content: JSON.stringify({
      instructions: prompt,
      base_plan: basePlan,
      client_profile: clientProfile,
    }),
  };

  // JSON mode: force a JSON object back
  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini", // or your chosen model
    temperature: 0,
    messages: [systemMsg, userMsg],
    response_format: { type: "json_object" }, // JSON-only mode
  });

  const raw = resp.choices[0].message.content;

  if (!raw) {
    throw new Error("No response from OpenAI");
  }

  // Backstop: if anything weird comes back, this will fail loudly
  const parsed = JSON.parse(raw);

  return parsed as PPCPlan;
}
```

Why this: JSON mode constrains the model to valid JSON via `response_format: { type: "json_object" }`; keep temp=0 for stable outputs. (OpenAI “structured outputs / JSON mode” docs confirm this pattern.) ([OpenAI Platform](https://platform.openai.com/docs/guides/structured-outputs?utm_source=chatgpt.com), [Stack Overflow](https://stackoverflow.com/questions/77434808/openai-api-how-do-i-enable-json-mode-using-the-gpt-4-vision-preview-model?utm_source=chatgpt.com), [Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/json-mode?utm_source=chatgpt.com))

## 2\) Define Validation Schemas with Zod

Use Zod for runtime validation of LLM responses. This ensures type safety and validates the structure matches your expectations.

```typescript
// libs/validation/src/schemas/ppc-plan.schema.ts
import { z } from "zod";

const KPISchema = z.object({
  CPA: z.number().min(0).optional(),
  ROAS: z.number().min(0).optional(),
  CTR: z.number().min(0).optional(),
  cpa_goal: z.number().min(0).optional(),
  roas_goal: z.number().min(0).optional(),
  ctr_goal: z.number().min(0).optional(),
  frequency_cap: z.number().int().min(0).optional(),
  cpm_goal: z.number().min(0).optional(),
  conversion_rate_goal: z.number().min(0).optional(),
});

const GenericCampaignSchema = z.object({
  name: z.string(),
  goal: z.string().optional(),
  audience: z.array(z.string()).optional(),
  ad_formats: z.array(z.string()).optional(),
  budget: z.number().min(0).optional(),
  bidding_strategy: z.string().optional(),
  kpis: KPISchema.optional(),
  messaging: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  watchouts: z.array(z.string()).optional(),
});

const CampaignSchema = z.object({
  name: z.string(),
  start_month: z.number().int().min(1).max(12),
  end_month: z.number().int().min(1).max(12),
  platform: z.enum(["Google Ads", "Google Display Network", "Meta Ads", "YouTube", "GA4", "GTM", "Other"]),
  budget_pct: z.number().min(0).max(100).optional(),
  bidding_strategy: z.string().optional(),
  kpis: KPISchema.optional(),
});

const SampleQuarterSchema = z.object({
  name: z.string(),
  goals: z.array(z.string()),
  campaigns: z.array(CampaignSchema),
});

const PhaseSchema = z.object({
  phase: z.string(),
  label: z.string(),
  months: z.array(z.number().int().min(1).max(12)),
  objectives: z.array(z.string()),
  tasks: z.array(z.string()),
});

const BudgetSchema = z.object({
  monthly_total: z.number().min(0),
  allocation_basis: z.enum(["percentage", "absolute"]),
  example_allocation: z.record(z.number().min(0)),
});

export const PPCPlanSchema = z.object({
  plan_type: z.literal("ppc"),
  version: z.string(),
  duration: z.string(),
  review_intervals: z.array(z.string()),
  revision_logic: z.string().optional(),
  client_data_linked: z.boolean().optional(),
  phases: z.array(PhaseSchema),
  sample_quarters: z.array(SampleQuarterSchema).optional(),
  budget: BudgetSchema.optional(),
  generic_campaigns: z.array(GenericCampaignSchema).optional(),
  revision_notes: z.array(z.string()).optional(),
});

// Export TypeScript type inferred from schema
export type PPCPlan = z.infer<typeof PPCPlanSchema>;

// Validation helper
export function validatePPCPlan(data: unknown): PPCPlan {
  return PPCPlanSchema.parse(data); // Throws if invalid
}
```

Tip: Zod schemas provide both runtime validation AND TypeScript types. Use `.parse()` to validate and throw on error, or `.safeParse()` for error handling without exceptions.

## 3\) Implement Plan Normalization in TypeScript

Make it do three things: (A) enforce `alva_tags_v1`, (B) normalize windows/dates/fields, (C) output deterministic ordering.

### **A) Enforce `alva_tags_v1`**

Load `tag_guide.json`, verify required facets, add/repair tags on campaigns/phases/tasks.

### **B) Normalize dates & fields**

- If phases only have month numbers, map to concrete windows against a base start date (you already used a `base_start_date` in your normalizer output).
- Canonicalize field names (e.g., `Google Display Network` → `google_display_network` in tags, while leaving human labels untouched where needed).
- Ensure `revision_notes` exists.

### **C) Deterministic ordering**

- Sort arrays (e.g., phases by phase number; campaigns by start_month then name).
- Serialize with `sort_keys=True` or use `orjson` with `OPT_SORT_KEYS`. ([Stack Overflow](https://stackoverflow.com/questions/34931386/how-do-i-keep-the-json-key-order-fixed-with-python-3-json-dumps?utm_source=chatgpt.com), [GitHub](https://github.com/ijl/orjson?utm_source=chatgpt.com))

**TypeScript Implementation:**

```typescript
// apps/api/src/services/plan-generation/normalize-ppc.service.ts
import { readFile, writeFile } from "fs/promises";
import type { PPCPlan, TagGuide } from "@alva/shared-types";

/**
 * @description Slugify a string to snake_case
 */
function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_");
}

/**
 * @description Add tags to an object safely (no duplicates)
 */
function addTags(obj: any, tags: string[]): void {
  if (!obj.tags) obj.tags = [];
  for (const tag of tags) {
    if (!obj.tags.includes(tag)) {
      obj.tags.push(tag);
    }
  }
}

/**
 * @description Enforce Alva tag standards on plan
 */
function enforceAlvaTags(plan: PPCPlan, tagGuide: TagGuide): PPCPlan {
  const std = tagGuide.standard || "alva_tags_v1";

  // Ensure _tag_standard field
  (plan as any)._tag_standard = std;

  // Derive plan version tags
  const planVersionTags: string[] = [];
  if (plan.plan_type && plan.version) {
    const planVersion = `plan:${plan.plan_type}_v${plan.version.replace(/\./g, "_")}`;
    planVersionTags.push(planVersion);
  }

  // Add tags to phases
  for (const ph of plan.phases) {
    const phaseSlug = slugify(ph.label || ph.phase);
    addTags(ph, [plan.plan_type, "domain:phase", `phase:${phaseSlug}`, ...planVersionTags]);
  }

  // Add tags to sample_quarters campaigns
  for (const sq of plan.sample_quarters || []) {
    for (const camp of sq.campaigns) {
      const platformSlug = slugify(camp.platform || "other");
      addTags(camp, [plan.plan_type, "domain:campaign", `platform:${platformSlug}`, ...planVersionTags]);
    }
  }

  // Add tags to generic_campaigns
  for (const camp of plan.generic_campaigns || []) {
    addTags(camp, [plan.plan_type, "domain:campaign", ...planVersionTags]);
  }

  return plan;
}

/**
 * @description Convert month number to date range
 */
function monthToDateRange(baseStart: Date, monthNum: number): [string, string] {
  // Month '1' means baseStart's month; '2' next month, etc.
  const year = baseStart.getFullYear() + Math.floor((baseStart.getMonth() + monthNum - 1) / 12);
  const month = (baseStart.getMonth() + monthNum - 1) % 12;

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0); // Last day of month

  return [start.toISOString().split("T")[0], end.toISOString().split("T")[0]];
}

/**
 * @description Normalize phase windows with concrete dates
 */
function normalizePhaseWindows(plan: PPCPlan, baseStartIso: string): PPCPlan {
  const baseStart = new Date(baseStartIso);

  for (const ph of plan.phases) {
    if (ph.months && ph.months.length > 0) {
      const [startDate] = monthToDateRange(baseStart, Math.min(...ph.months));
      const [, endDate] = monthToDateRange(baseStart, Math.max(...ph.months));

      (ph as any).window = {
        start_date: startDate,
        end_date: endDate,
      };
    }
  }

  return plan;
}

/**
 * @description Canonicalize field formats
 */
function canonicalizeFields(plan: PPCPlan): PPCPlan {
  // Ensure revision_notes exists
  if (!plan.revision_notes) {
    plan.revision_notes = [];
  }

  // Title case review_intervals
  if (plan.review_intervals) {
    plan.review_intervals = plan.review_intervals.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase());
  }

  return plan;
}

/**
 * @description Sort arrays for deterministic output
 */
function sortArrays(plan: PPCPlan): PPCPlan {
  // Sort phases by min month
  plan.phases.sort((a, b) => Math.min(...a.months) - Math.min(...b.months));

  // Sort campaigns in sample_quarters
  for (const sq of plan.sample_quarters || []) {
    sq.campaigns.sort((a, b) => {
      if (a.start_month !== b.start_month) {
        return a.start_month - b.start_month;
      }
      return a.name.localeCompare(b.name);
    });
  }

  // Sort generic_campaigns by name
  if (plan.generic_campaigns) {
    plan.generic_campaigns.sort((a, b) => a.name.localeCompare(b.name));
  }

  return plan;
}

/**
 * @description Main normalization function
 */
export async function normalizePPCPlan(
  inputPath: string,
  outputPath: string,
  baseStartDate: string = "2025-08-01",
  tagGuidePath?: string
): Promise<PPCPlan> {
  // Load plan
  const planData = JSON.parse(await readFile(inputPath, "utf-8"));
  let plan = planData as PPCPlan;

  // Load tag guide if available
  let tagGuide: TagGuide = { standard: "alva_tags_v1", examples: [] };
  if (tagGuidePath) {
    tagGuide = JSON.parse(await readFile(tagGuidePath, "utf-8"));
  }

  // Apply normalizations
  plan = enforceAlvaTags(plan, tagGuide);
  plan = normalizePhaseWindows(plan, baseStartDate);
  plan = canonicalizeFields(plan);
  plan = sortArrays(plan);

  // Write with deterministic key ordering
  await writeFile(outputPath, JSON.stringify(plan, null, 2));

  return plan;
}
```

**Usage in API Server:**

```typescript
// apps/api/src/services/plan-generation/ppc.generator.ts
import { generateWithLLM } from "./llm.service";
import { normalizePPCPlan } from "./normalize-ppc.service";
import { validatePPCPlan } from "@alva/validation";
import type { ClientProfile } from "@alva/shared-types";

export async function generatePPCPlan(clientProfile: ClientProfile): Promise<PPCPlan> {
  // 1. Generate raw plan from LLM
  const rawPlan = await generateWithLLM(
    "./data/prompts/ppc_prompt.json",
    "./data/templates/ppc_base.json",
    clientProfile
  );

  // 2. Validate with Zod
  const validatedPlan = validatePPCPlan(rawPlan);

  // 3. Normalize (tags, dates, sorting)
  const normalizedPlan = await normalizePPCPlan(validatedPlan, clientProfile.user_profile.business_name);

  return normalizedPlan;
}
```

Notes:

- TypeScript provides compile-time type safety
- Zod provides runtime validation
- JSON.stringify with `null, 2` creates deterministic, readable output

# Normalization Scripts to Ensure All Tasks/Events are Date-Aligned and Tagged Consistently

## What I did (now)

- Built a normalization pipeline that converts your PPC phases, objectives, tasks, and campaigns into **calendar-aligned events** with **consistent, snake_case tags**.
- Defaulted the plan start to the **first day of the current month** (changeable on run).
- Output is a single `normalized_events.json` ready for ClickUp import, Google Calendar bridging, or your Alva engine.

## Deliverables

- normalized_events.json — 51 normalized events with start/end dates \+ tags
- normalize-ppc.service.ts — TypeScript service to normalize plans
- tag_guide.json — facet schema and examples for consistent tagging

## How to use

Run via API endpoint (defaults to first day of current month):

```bash
# Via API endpoint
curl -X POST http://localhost:3001/api/plans/normalize \
  -H "Content-Type: application/json" \
  -d '{"plan_id": "ppc-001", "client_id": "scent-sparkle"}'
```

Run via CLI script:

```bash
# Using pnpm script
pnpm run normalize:plan --plan-id ppc-001 --start-date 2025-09-01
```

## What’s normalized

- **Phases** → “phase_window” events with real start/end dates
- **Objectives** → “objective” events aligned to their phase window
- **Tasks** → “task” events aligned to their phase window
- **Campaigns** (quarters & generic) → date-ranged “campaign” events
- **“Always-on”** → spans full 12 months
- **Tags** → `["ppc","plan:ppc_v1_0","phase:foundation_and_strategy","domain:task","platform:google_ads", "module:ppc_plan_generator","module_type:strategy_adaptation"]` (as applicable)

## Standards enforced

- **Tag schema (“alva_tags_v1”)**
  - `domain:*` ∈ {phase, objective, task, campaign}
  - `phase:*` \= slug of phase label
  - `platform:*` when inferable (e.g., google_ads, google_display_network)
  - `plan:ppc_v{version}` (from your JSON)
  - `module:*`, `module_type:*` (from your module metadata)

## Notes on input files

- `ppc.json` is the only file driving tasks/events.
- `blog_prompt.json` supplies module tags for traceability.
- `ppc_prompt.json` contains prompt instructions for LLM generation.

## Next steps

1. **Set the real start date** for this client's plan via API:

```bash
# Using API endpoint
curl -X POST http://localhost:3001/api/plans/normalize \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "ppc-001",
    "client_id": "scent-sparkle",
    "start_date": "YYYY-MM-DD"
  }'

# Or via CLI
pnpm run normalize:plan --plan-id ppc-001 --start-date YYYY-MM-DD
```

2. **Wire the output**:
   - If you're using ClickUp/Jira: map `title`, `start_date`, `end_date`, and `tags`.
   - If you're bridging to Calendar: import only `type in {campaign, phase_window}` to avoid noise; keep tasks in PM.
3. **Enforce inputs**: going forward, require `start_date` at intake. No "Month X–Y" talk in source—force ISO dates or a relative-month spec with a known base date.
4. **Adopt the tag guide**: use `tag_guide.json` across modules so reporting, filters, and automations remain stable.

# App Pages

Marketing Plan

Daily Quick Win

Chat With Alva

**Visual mockups available:**

- Mobile onboarding flow: [26 interactive cards](../mockups/mobile/)
- Desktop application: [Complete interface designs](../mockups/web/)
- See [mockups/README.md](../mockups/README.md) for detailed breakdown
