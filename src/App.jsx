import React, { useState, useEffect } from 'react';
    import { getGeminiResponse } from './api/gemini';
    import { getMistralResponse } from './api/mistral';
    import { getCerebrasResponse } from './api/cerebras';

    const API_KEYS = {
      gemini: 'YOUR_GEMINI_API_KEY',
      mistral: 'YOUR_MISTRAL_API_KEY',
      cerebras: 'YOUR_CEREBRAS_API_KEY',
    };

    function App() {
      const [messages, setMessages] = useState([]);
      const [input, setInput] = useState('');
      const [history, setHistory] = useState([]);

      useEffect(() => {
        const storedHistory = localStorage.getItem('chatHistory');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      }, []);

      useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(history));
      }, [history]);

      const handleInputChange = (event) => {
        setInput(event.target.value);
      };

      const sendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);
        setInput('');
        setHistory([...history, input]);

        try {
          const geminiResponse = await getGeminiResponse(input, API_KEYS.gemini);
          const mistralResponse = await getMistralResponse(input, API_KEYS.mistral);
          const cerebrasResponse = await getCerebrasResponse(input, API_KEYS.cerebras);

          setMessages((prevMessages) => [
            ...prevMessages,
            { text: geminiResponse, sender: 'gemini' },
            { text: mistralResponse, sender: 'mistral' },
            { text: cerebrasResponse, sender: 'cerebras' },
          ]);
        } catch (error) {
          console.error('Error fetching API responses:', error);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: 'Error fetching response', sender: 'error' },
          ]);
        }
      };

      return (
        <div className="chat-container">
          <div className="chat-header">
            <h2>Multi-API Chat</h2>
          </div>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}-message`}>
                {message.sender}: {message.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message here..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          <div>
            <h3>History</h3>
            <ul>
              {history.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    export default App;
