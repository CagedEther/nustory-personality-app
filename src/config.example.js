// Configuration file for API keys and prompts
// The API key is loaded from environment variables
// Create a .env file in the root directory with: VITE_OPENAI_API_KEY=your-actual-api-key-here
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Prompt template for generating ads
// Variables: {persona}, {merged_ad_guidance}, {keyMessage}
export const AD_GENERATION_PROMPT = `For {persona} create 5 ad messaging/visual examples by applying the {merged_ad_guidance} to the {keyMessage}. 

For each ad example, provide:
1. A catchy headline
2. Main ad copy (2-3 sentences)
3. Visual guidance (detailed description of the image/visual elements that should accompany this ad)

Format each example as:
Ad Example [number]:
Headline: [headline]
Copy: [ad copy]
Visual: [visual guidance]`;

// Function to build the prompt with actual values
export const buildAdPrompt = (persona, mergedAdGuidance, keyMessage) => {
  return AD_GENERATION_PROMPT
    .replace('{persona}', persona)
    .replace('{merged_ad_guidance}', mergedAdGuidance)
    .replace('{keyMessage}', keyMessage);
}; 