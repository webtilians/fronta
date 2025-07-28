import React, { useState } from 'react';
import useApi from '../hooks/useApi';
import './TestPanel.css';

const TestPanel = ({ isOpen, onClose }) => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const { getHealth, getHabitaciones, getReservas, sendMessage } = useApi();

  const runTest = async (testName, testFn) => {
    setIsRunning(true);
    try {
      const startTime = Date.now();
      const result = await testFn();
      const endTime = Date.now();
      
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: true,
          data: result,
          time: endTime - startTime,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: false,
          error: error.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setIsRunning(false);
    }
  };

  const tests = [
    {
      name: 'health',
      label: 'Server status',
      fn: () => getHealth()
    },
    {
      name: 'habitaciones',
      label: 'List rooms',
      fn: () => getHabitaciones()
    },
    {
      name: 'reservas',
      label: 'List reservations',
      fn: () => getReservas()
    },
    {
      name: 'chat',
      label: 'Send test message',
      fn: () => sendMessage('What room types are available?', [])
    },
    {
      name: 'chatAlternativo',
      label: 'Chat (direct endpoint)',
      fn: async () => {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const sessionId = localStorage.getItem('session_id') || 'test_session';
        
        const response = await fetch(`${baseUrl}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Please respond in English. Are there rooms available for tomorrow?',
            session_id: sessionId
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        return await response.json();
      }
    }
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.name, test.fn);
      // Small pause between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="test-panel-overlay">
      <div className="test-panel">
        <div className="test-panel-header">
          <h3>🧪 API Test Panel</h3>
          <button onClick={onClose} className="close-button">✕</button>
        </div>
        
        <div className="test-panel-content">
          <div className="test-controls">
            <button 
              onClick={runAllTests}
              disabled={isRunning}
              className="run-all-button"
            >
              {isRunning ? '⏳ Running...' : '🚀 Run All Tests'}
            </button>
          </div>

          <div className="test-grid">
            {tests.map(test => (
              <div key={test.name} className="test-item">
                <div className="test-header">
                  <span className="test-label">{test.label}</span>
                  <button 
                    onClick={() => runTest(test.name, test.fn)}
                    disabled={isRunning}
                    className="test-button"
                  >
                    🧪 Test
                  </button>
                </div>
                
                {testResults[test.name] && (
                  <div className={`test-result ${testResults[test.name].success ? 'success' : 'error'}`}>
                    <div className="result-header">
                      <span className="result-status">
                        {testResults[test.name].success ? '✅' : '❌'}
                      </span>
                      <span className="result-time">
                        {testResults[test.name].timestamp}
                        {testResults[test.name].time && ` (${testResults[test.name].time}ms)`}
                      </span>
                    </div>
                    
                    <div className="result-content">
                      {testResults[test.name].success ? (
                        <pre>{JSON.stringify(testResults[test.name].data, null, 2)}</pre>
                      ) : (
                        <div className="error-message">
                          {testResults[test.name].error}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPanel;
