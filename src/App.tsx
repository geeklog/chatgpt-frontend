import { useState } from 'react';
import './App.css';

const CHATGPT_API_ENDPOINT = 'https://chatgpt-api-server.vercel.app/chat'

function App() {
  const [chatHistory, setChatHistory] = useState<Array<string>>([]);
  
  const [prompt, setPrompt] = useState('');

  const handleInput = (event: any) => {
    setPrompt(event.target.value);
  }

  const handleSubmit = async () => {
    const currHistory = [...chatHistory, '我: ' + prompt];
    setChatHistory(currHistory);

    await new Promise((r) => setTimeout(r, 1000));
    const response = await fetch(CHATGPT_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    setChatHistory([...currHistory, 'ChatGPT: ' + data.answer.trim()]);
    setPrompt('');
  }

  return (
    <div className='app'>
      <div className='chatHistory'>{
        chatHistory.map(chatLine =>
          <div className='chatLine'>{
            chatLine.split('\n').map(sentence =>
              <><span>{sentence}</span><br/></>
            )
          }</div>
        )
      }</div>
      <div className='prompt'>
        <textarea className='prompt-input' value={prompt} onChange={handleInput} />
      </div>
      <div className='submit'>
        <button onClick={handleSubmit}>提交</button>
      </div>
    </div>
  );
}

export default App;