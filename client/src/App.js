import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/chat', {
        message: input,
        history: messages
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Oops! Is backend running on port 5000?'
      }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Segoe UI, system-ui, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 25px 45px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '32px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Bot style={{ width: '40px', height: '40px', color: 'white' }} />
          </div>
          <h1 style={{
            fontSize: '36px', fontWeight: 'bold',
            background: 'linear-gradient(45deg, white, #e0e0e0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            CS Interview Mentor
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px' }}>
            Your AI-powered coding interview coach
          </p>
        </div>

        {/* Messages */}
        <div style={{
          height: '400px',
          overflowY: 'auto',
          marginBottom: '24px',
          padding: '24px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', padding: '48px 0' }}>
              <Bot style={{ width: '64px', height: '64px', margin: '0 auto 16px', opacity: 0.5 }} />
              <p>Ask me about DFA, NFA, algorithms, system design, or paste buggy code!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '16px 20px',
                  borderRadius: '20px',
                  color: msg.role === 'user' ? '#1a1a1a' : 'white',
                  background: msg.role === 'user'
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.15)',
                  boxShadow: msg.role === 'user' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                  border: msg.role !== 'user' ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  backdropFilter: msg.role !== 'user' ? 'blur(10px)' : 'none'
                }}>
                  <div style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {msg.content.split('\n').map((line, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        {line.startsWith('**') ?
                          <strong style={{ color: '#4f46e5' }}>{line}</strong> :
                          line
                        }
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            ))
          )}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '16px 20px',
                borderRadius: '20px',
                color: 'white',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '24px', height: '24px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          display: 'flex', gap: '12px',
          padding: '16px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <input
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              outline: 'none',
              fontSize: '16px'
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about DFA vs NFA, debug code, interview tips..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              width: '48px', height: '48px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              opacity: input.trim() && !loading ? 1 : 0.5
            }}
          >
            <Send style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Example prompts */}
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '12px' }}>
            Try these:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              "Explain DFA vs NFA",
              "Debug this Python code",
              "System design Twitter",
              "Top 5 array questions"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
