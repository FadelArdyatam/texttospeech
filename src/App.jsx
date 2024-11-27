// Frontend (App.jsx)
import { useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [text, setText] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSynthesize = async () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:3001/synthesize', {
        text
      });
      
      if (response.data.audioContent) {
        const audioSrc = `data:audio/mp3;base64,${response.data.audioContent}`;
        setAudioSrc(audioSrc);
      } else {
        throw new Error('No audio content received');
      }
    } catch (err) {
      setError(err.message || 'Failed to synthesize speech');
      setAudioSrc(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className='ml-10 bg-blue-400 p-4 rounded-lg'>
        <h1 className="text-2xl font-bold mb-4">Testing Suara GCP</h1>
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder='Enter text to synthesize'
          className="w-full p-2 mb-4 rounded"
          disabled={isLoading}
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button 
          onClick={handleSynthesize}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Synthesizing...' : 'Synthesize'}
        </button>
        {audioSrc && <audio src={audioSrc} controls className="mt-4 w-full" />}
      </div>
    </div>
  )
}

export default App