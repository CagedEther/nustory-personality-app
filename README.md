# Nustory Personality App

A React-based web application for generating marketing ad guidance using Jungian archetypes and AI-powered content generation.

## Features

- **Three-section layout**: Input, Run, and Results
- **Archetype Selection**: Choose from 12 Jungian archetypes with visual selection interface (2 rows x 6 columns)
- **Dynamic Archetype Merging**: Automatically combines selected archetypes and displays merged descriptions
- **AI-Powered Ad Generation**: Uses OpenAI's GPT API to generate personalized marketing ad examples with visual guidance
- **Responsive Design**: Works on desktop and mobile devices

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your OpenAI API key:

```bash
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

You can use the `.env.example` file as a template.

You can also customize the AI prompt for generating ads by editing the `AD_GENERATION_PROMPT` variable in the same file. The prompt uses placeholders for:
- `{persona}` - The target persona
- `{merged_ad_guidance}` - The combined archetype guidance
- `{keyMessage}` - The key message input

### 3. Run the Application
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## How to Use

### 1. Input Section (Left)
- Enter your **Persona** (target audience)
- Enter your **Key message** (main marketing message)

### 2. Run Section (Middle)
- Select **2 archetypes** from the grid of 12 Jungian archetypes
- Selected archetypes will be highlighted and names will appear in the boxes below
- A **merged description** will automatically appear when 2 archetypes are selected
- Click **Go** to generate ads (button is disabled until all fields are filled)

### 3. Results Section (Right)
- View **5 AI-generated ad examples**, each containing:
  - **Headline**: Catchy ad title
  - **Copy**: Main ad message (2-3 sentences)
  - **Visual**: Detailed guidance for the ad's visual elements

## Jungian Archetypes

The app includes all 12 classic Jungian archetypes:
- The Hero - Empowerment and triumph
- The Sage - Wisdom and knowledge
- The Everyman - Relatability and community
- The Outlaw - Rebellion and disruption
- The Lover - Beauty and relationships
- The Caregiver - Care and protection
- The Jester - Fun and humor
- The Explorer - Adventure and discovery
- The Innocent - Purity and simplicity
- The Creator - Innovation and creativity
- The Ruler - Leadership and luxury
- The Magician - Transformation and possibility

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **OpenAI GPT API** - AI-powered ad generation
- **CSS Grid & Flexbox** - Modern responsive layouts

## File Structure

```
src/
├── App.jsx                    # Main application component
├── App.css                    # Application styles
├── config.js                  # API key and prompt configuration
├── jungian-archetypes.json    # Individual archetype data
└── jungian-archetypes-x2.json # Merged archetype combinations
```

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub** (make sure .env is in .gitignore)

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite React app

3. **Set Environment Variables**:
   - In your Vercel project dashboard, go to Settings → Environment Variables
   - Add: `VITE_OPENAI_API_KEY` with your OpenAI API key value
   - Make sure to add it for all environments (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy" - Vercel will build and deploy your app
   - Your app will be available at a vercel.app URL

### Build Locally
```bash
npm run build
npm run preview
```

## Notes

- The app requires an OpenAI API key to function
- Generated ads include both messaging and visual guidance
- The interface is optimized for switching between different archetype combinations
- Never commit your .env file - it contains sensitive API keys
- All API calls are made client-side (suitable for local development)
