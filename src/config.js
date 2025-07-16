// Configuration file for API keys and prompts
// The API key is now loaded from environment variables
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Prompt template for generating ads
// Variables: {persona}, {merged_ad_guidance}, {keyMessage}
export const AD_GENERATION_PROMPT = `You are a creative strategist working for a brand that embodies the {persona} archetype. This archetype is the BRAND'S PERSONALITY - it defines how this brand thinks, speaks, and connects with people.

BRAND PERSONALITY GUIDELINES:
{merged_ad_guidance}

Your task: Create 5 Facebook ads about {keyMessage}, where the BRAND speaks in their authentic {persona} voice.

CRITICAL INSTRUCTIONS:
- The archetype is WHO the brand IS, not what the brand talks about
- Write as if this brand personality is speaking directly to customers
- The {persona} archetype shapes the brand's communication style, tone, word choice, and approach
- DO NOT mention the archetype name or use obvious archetype references
- Focus on HOW this brand personality would naturally discuss {keyMessage}
- Let the archetype's worldview, values, and communication patterns naturally infuse every word

EXAMPLE APPROACH:
- A Jester brand doesn't say "laugh your way to success" - they communicate with wit, playfulness, and clever observations
- A Hero brand doesn't say "be heroic" - they speak with confidence, challenge conventions, and inspire action
- A Sage brand doesn't say "wisdom" - they share insights, ask thoughtful questions, and speak with quiet authority

For each ad, provide:
1. Headline: Written in this brand's authentic voice and style
2. Copy: 2-3 sentences showing how THIS brand personality would discuss the topic
3. Visual: Aesthetic that reflects this brand's personality and communication approach

Format as:
Ad Example [number]:
Headline: [headline in brand voice]
Copy: [brand personality speaking naturally about the topic]  
Visual: [visual direction that matches brand personality]`;

// Function to build the prompt with actual values
export const buildAdPrompt = (persona, mergedAdGuidance, keyMessage) => {
  return AD_GENERATION_PROMPT
    .replaceAll('{persona}', persona)
    .replaceAll('{merged_ad_guidance}', mergedAdGuidance)
    .replaceAll('{keyMessage}', keyMessage);
}; 
