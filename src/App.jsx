import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import archetypesData from './jungian-archetypes.json';
import mergedArchetypesData from './jungian-archetypes-x2.json';
import { OPENAI_API_KEY, buildAdPrompt } from './config.js';

// Import archetype images
import caregiverImg from './personality-images/caregiver.png';
import creatorImg from './personality-images/creator.png';
import everymanImg from './personality-images/everyman.png';
import explorerImg from './personality-images/explorer.png';
import heroImg from './personality-images/hero.png';
import innocentImg from './personality-images/innocent.png';
import jesterImg from './personality-images/jester.png';
import loverImg from './personality-images/lover.png';
import magicianImg from './personality-images/magician.png';
import outlawImg from './personality-images/outlaw.png';
import rulerImg from './personality-images/ruler.png';
import sageImg from './personality-images/sage.png';
import nustoryLogo from './assets/nustory-logo.png';

// Create a mapping object for archetype images
const archetypeImages = {
  'The Hero': heroImg,
  'The Sage': sageImg,
  'The Everyman': everymanImg,
  'The Outlaw': outlawImg,
  'The Lover': loverImg,
  'The Caregiver': caregiverImg,
  'The Jester': jesterImg,
  'The Explorer': explorerImg,
  'The Innocent': innocentImg,
  'The Creator': creatorImg,
  'The Ruler': rulerImg,
  'The Magician': magicianImg
};

function App() {
  const [persona, setPersona] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [selectedArchetypes, setSelectedArchetypes] = useState([]);
  const [mergedArchetype, setMergedArchetype] = useState(null);
  const [adResults, setAdResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [archetypeMode, setArchetypeMode] = useState('double'); // 'single' or 'double'
  
  // New state for cycling archetypes
  const [currentArchetypeIndex, setCurrentArchetypeIndex] = useState(0);

  const archetypes = archetypesData.jungian_archetypes;

  // Cycling effect for archetype thumbnails
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentArchetypeIndex((prevIndex) => 
        (prevIndex + 1) % archetypes.length
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [archetypes.length]);

  const handleArchetypeSelect = (archetype) => {
    if (archetypeMode === 'single') {
      // Single mode: only allow one archetype
      if (selectedArchetypes.includes(archetype)) {
        setSelectedArchetypes([]);
        setMergedArchetype(null);
      } else {
        setSelectedArchetypes([archetype]);
        setMergedArchetype(null);
      }
    } else {
      // Double mode: existing logic
      if (selectedArchetypes.includes(archetype)) {
        // Remove if already selected
        const newSelected = selectedArchetypes.filter(a => a !== archetype);
        setSelectedArchetypes(newSelected);
        
        // Update merged archetype
        if (newSelected.length === 2) {
          updateMergedArchetype(newSelected[0], newSelected[1]);
        } else {
          setMergedArchetype(null);
        }
      } else if (selectedArchetypes.length < 2) {
        // Add if less than 2 selected
        const newSelected = [...selectedArchetypes, archetype];
        setSelectedArchetypes(newSelected);
        
        // Update merged archetype if we now have 2
        if (newSelected.length === 2) {
          updateMergedArchetype(newSelected[0], newSelected[1]);
        }
      } else {
        // Replace first archetype if 2 already selected
        const newSelected = [selectedArchetypes[1], archetype];
        setSelectedArchetypes(newSelected);
        updateMergedArchetype(newSelected[0], newSelected[1]);
      }
    }
  };

  const updateMergedArchetype = (arch1, arch2) => {
    const merged = mergedArchetypesData.merged_jungian_archetypes.find(item => 
      (item.archetype_1 === arch1.archetype && item.archetype_2 === arch2.archetype) ||
      (item.archetype_1 === arch2.archetype && item.archetype_2 === arch1.archetype)
    );
    setMergedArchetype(merged);
  };

  const handleRandomSelection = () => {
    if (archetypeMode === 'single') {
      // Select one random archetype
      const randomIndex = Math.floor(Math.random() * archetypes.length);
      const randomArchetype = archetypes[randomIndex];
      setSelectedArchetypes([randomArchetype]);
      setMergedArchetype(null);
    } else {
      // Select two random archetypes
      const shuffled = [...archetypes].sort(() => 0.5 - Math.random());
      const randomPair = shuffled.slice(0, 2);
      setSelectedArchetypes(randomPair);
      updateMergedArchetype(randomPair[0], randomPair[1]);
    }
  };

  const handleModeChange = (mode) => {
    setArchetypeMode(mode);
    // Reset selections when switching modes
    setSelectedArchetypes([]);
    setMergedArchetype(null);
  };

  const generateAds = async () => {
    // Validation based on mode
    if (archetypeMode === 'single') {
      if (!persona || !keyMessage || selectedArchetypes.length !== 1) {
        alert('Please fill in all fields and select exactly 1 archetype');
        return;
      }
    } else {
      if (!persona || !keyMessage || selectedArchetypes.length !== 2 || !mergedArchetype) {
        alert('Please fill in all fields and select exactly 2 archetypes');
        return;
      }
    }

    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
      alert('Please set your OpenAI API key in the .env file (VITE_OPENAI_API_KEY)');
      return;
    }

    setLoading(true);
    setAdResults([]);

    try {
      let prompt;
      if (archetypeMode === 'single') {
        // Use single archetype guidance
        prompt = buildAdPrompt(persona, selectedArchetypes[0].ad_creation_guidance, keyMessage);
      } else {
        // Use merged archetype guidance
        prompt = buildAdPrompt(persona, mergedArchetype.merged_ad_guidance, keyMessage);
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedContent = response.data.choices[0].message.content;
      const examples = parseAdExamples(generatedContent);
      setAdResults(examples);
    } catch (error) {
      console.error('Error generating ads:', error);
      alert('Error generating ads. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseAdExamples = (content) => {
    const examples = [];
    const adBlocks = content.split(/Ad Example \d+:/);
    
    for (let i = 1; i < adBlocks.length; i++) {
      const block = adBlocks[i];
      const headlineMatch = block.match(/Headline:\s*(.+)/);
      const copyMatch = block.match(/Copy:\s*(.+?)(?=Visual:|$)/s);
      const visualMatch = block.match(/Visual:\s*(.+)/s);
      
      if (headlineMatch && copyMatch) {
        examples.push({
          headline: headlineMatch[1].trim(),
          copy: copyMatch[1].trim(),
          visual: visualMatch ? visualMatch[1].trim() : 'Visual guidance not provided'
        });
      }
    }
    
    return examples;
  };

  const copyAdToClipboard = async (ad, adNumber) => {
    // Build archetype information
    let archetypeInfo = '';
    if (archetypeMode === 'single' && selectedArchetypes.length === 1) {
      archetypeInfo = `Archetype: ${selectedArchetypes[0].archetype}`;
    } else if (archetypeMode === 'double' && selectedArchetypes.length === 2) {
      archetypeInfo = `Archetypes: ${selectedArchetypes[0].archetype} + ${selectedArchetypes[1].archetype}`;
      if (mergedArchetype) {
        archetypeInfo += `\nMerged Archetype: ${mergedArchetype.merged_archetype}`;
      }
    }

    const adText = `Ad ${adNumber}

${archetypeInfo}

Headline: ${ad.headline}

Copy: ${ad.copy}

Visual: ${ad.visual}`;

    try {
      await navigator.clipboard.writeText(adText);
      // You could add a toast notification here if desired
      console.log('Ad copied to clipboard');
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = adText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Ad copied to clipboard (fallback)');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <img src={nustoryLogo} alt="Nustory" className="logo" />
        <div className="cycling-archetype">
          <span className="cycling-label">
            Creating ads using Jungian archetypes
          </span>
          <img 
            src={archetypeImages[archetypes[currentArchetypeIndex].archetype]}
            alt={archetypes[currentArchetypeIndex].archetype}
            className="cycling-thumbnail"
          />
        </div>
      </header>
      <div className="container">
        {/* INPUT & RUN Section */}
        <div className="section input-run-section">
          <div className="input-section">
            <h2>INPUT AD DETAILS</h2>
            <div className="input-group">
              <label>Persona</label>
              <input
                type="text"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="Enter target persona..."
              />
            </div>
            <div className="input-group">
              <label>Key message</label>
              <textarea
                value={keyMessage}
                onChange={(e) => setKeyMessage(e.target.value)}
                placeholder="Enter key message..."
                rows="4"
              />
            </div>

            {/* Archetype Controls */}
            <div className="archetype-controls">
              <div className="controls-row">
                <div className="mode-selector">
                  <label>Archetype Mode</label>
                  <div className="toggle-buttons">
                    <button 
                      className={`toggle-btn ${archetypeMode === 'single' ? 'active' : ''}`}
                      onClick={() => handleModeChange('single')}
                    >
                      Single
                    </button>
                    <button 
                      className={`toggle-btn ${archetypeMode === 'double' ? 'active' : ''}`}
                      onClick={() => handleModeChange('double')}
                    >
                      Double
                    </button>
                  </div>
                </div>
                <button 
                  className="random-btn"
                  onClick={handleRandomSelection}
                  title="Select random archetype(s)"
                >
                  Random
                </button>
              </div>
            </div>
          </div>
          
          <div className="run-section">
          <div className="archetype-grid">
            {archetypes.map((archetype, index) => (
              <div
                key={index}
                className={`archetype-item ${selectedArchetypes.includes(archetype) ? 'selected' : ''}`}
                onClick={() => handleArchetypeSelect(archetype)}
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${archetypeImages[archetype.archetype]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <span className="archetype-text">{archetype.archetype}</span>
              </div>
            ))}
          </div>
          
          <div className="selected-archetypes">
            {archetypeMode === 'single' ? (
              <div className="archetype-box single-mode">
                <label>Selected Archetype</label>
                <div className="archetype-name">
                  {selectedArchetypes[0] ? selectedArchetypes[0].archetype : 'Select an archetype'}
                </div>
                {selectedArchetypes[0] && (
                  <div className="archetype-description">
                    {selectedArchetypes[0].ad_creation_guidance}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="archetype-box">
                  <label>Archetype X</label>
                  <div className="archetype-name">
                    {selectedArchetypes[0] ? selectedArchetypes[0].archetype : 'Select first archetype'}
                  </div>
                </div>
                <div className="archetype-box">
                  <label>Archetype Y</label>
                  <div className="archetype-name">
                    {selectedArchetypes[1] ? selectedArchetypes[1].archetype : 'Select second archetype'}
                  </div>
                </div>
              </>
            )}
          </div>

          {mergedArchetype && (
            <div className="merged-description">
              <h3>{mergedArchetype.merged_name}</h3>
              <p>{mergedArchetype.merged_ad_guidance}</p>
            </div>
          )}

          <button 
            className="go-button"
            onClick={generateAds}
            disabled={loading || !persona || !keyMessage || 
              (archetypeMode === 'single' && selectedArchetypes.length !== 1) ||
              (archetypeMode === 'double' && selectedArchetypes.length !== 2)}
          >
            {loading ? 'Generating...' : 'Go'}
          </button>
          </div>
        </div>

        {/* RESULTS Section */}
        <div className="section">
          <h2>AD RESULTS</h2>
          <div className="results-container">
            {loading && <div className="loading">Generating ads...</div>}
            {adResults.length > 0 ? (
              adResults.map((ad, index) => (
                <div key={index} className="ad-result">
                  <div className="ad-header">
                    <div className="ad-number">Ad {index + 1}</div>
                    <button 
                      className="copy-button"
                      onClick={() => copyAdToClipboard(ad, index + 1)}
                      title="Copy ad to clipboard"
                    >
                      COPY
                    </button>
                  </div>
                  <div className="ad-headline">{ad.headline}</div>
                  <div className="ad-copy">{ad.copy}</div>
                  <div className="ad-visual">
                    <strong>Visual:</strong> {ad.visual}
                  </div>
                </div>
              ))
            ) : (
              !loading && (
                <div className="placeholder">
                  {Array.from({length: 5}, (_, i) => (
                    <div key={i} className="ad-placeholder">
                      <div className="placeholder-title">Ad {i + 1}</div>
                      <div className="placeholder-content">
                        <div className="placeholder-line"></div>
                        <div className="placeholder-line"></div>
                        <div className="placeholder-line short"></div>
                        <div className="placeholder-visual">
                          <strong>Visual:</strong> <span className="placeholder-line short"></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
