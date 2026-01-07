import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Analytics() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showRespondents, setShowRespondents] = useState(false);

  useEffect(() => {
    fetchAnalytics();
    fetchSurvey();
    fetchResponses();
  }, [id]);

  const fetchSurvey = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/surveys/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSurvey(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/responses/analytics/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResponses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/responses/survey/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setResponses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!analytics || !survey) return <div>Loading...</div>;

  const getChartData = (question) => {
    if (question.type === 'multiple-choice') {
      return {
        labels: Object.keys(question.data),
        datasets: [{
          data: Object.values(question.data),
          backgroundColor: [
            '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'
          ]
        }]
      };
    }
    return null;
  };

  return (
    <div>
      <h1>Analytics: {survey.title}</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{analytics.totalResponses}</h3>
          <p>Total Responses</p>
        </div>
        <div className="stat-card">
          <h3>{survey.questions.length}</h3>
          <p>Questions</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Respondents</h2>
          <button 
            onClick={() => setShowRespondents(!showRespondents)}
            className="btn btn-secondary"
            style={{ fontSize: '14px', padding: '0.5rem 1rem' }}
          >
            {showRespondents ? 'Hide' : 'Show'} Respondents ({responses.length})
          </button>
        </div>
        
        {showRespondents && (
          <div style={{ marginTop: '1rem' }}>
            {responses.length === 0 ? (
              <p style={{ color: '#7f8c8d' }}>No responses yet</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(0, 212, 255, 0.3)' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', color: '#00d4ff' }}>#</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', color: '#00d4ff' }}>Name</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', color: '#00d4ff' }}>Email</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', color: '#00d4ff' }}>Submitted At</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', color: '#00d4ff' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((response, index) => (
                      <tr key={response._id} style={{ borderBottom: '1px solid rgba(0, 212, 255, 0.1)' }}>
                        <td style={{ padding: '0.75rem', color: '#b0b0b0' }}>{index + 1}</td>
                        <td style={{ padding: '0.75rem', color: '#e0e0e0' }}>
                          {response.submittedBy?.name || response.respondentName || 'Anonymous'}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#b0b0b0' }}>
                          {response.submittedBy?.email || response.respondentEmail || 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#b0b0b0' }}>
                          {new Date(response.submittedAt).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {response.submittedBy ? (
                            <span style={{ 
                              background: 'rgba(81, 207, 102, 0.2)', 
                              color: '#51cf66', 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '4px',
                              fontSize: '12px',
                              border: '1px solid rgba(81, 207, 102, 0.3)'
                            }}>
                              Registered User
                            </span>
                          ) : (
                            <span style={{ 
                              background: 'rgba(255, 167, 38, 0.2)', 
                              color: '#ffa726', 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '4px',
                              fontSize: '12px',
                              border: '1px solid rgba(255, 167, 38, 0.3)'
                            }}>
                              Guest
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {analytics.questions.map((question, index) => (
        <div key={question.questionId} className="card">
          <h3>Question {index + 1}: {question.text}</h3>
          
          {question.type === 'multiple-choice' && (
            <div className="chart-container">
              <Pie data={getChartData(question)} />
            </div>
          )}

          {question.type === 'rating' && (
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
                Average Rating: {question.average} / 5
              </p>
              <div className="chart-container">
                <Bar
                  data={{
                    labels: ['1', '2', '3', '4', '5'],
                    datasets: [{
                      label: 'Number of Responses',
                      data: [1, 2, 3, 4, 5].map(rating => 
                        question.responses.filter(r => r === rating).length
                      ),
                      backgroundColor: '#3498db'
                    }]
                  }}
                />
              </div>
            </div>
          )}

          {question.type === 'short-answer' && (
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                {question.answers.length} Responses
              </p>
              <ul style={{ listStyle: 'none' }}>
                {question.answers.map((answer, i) => (
                  <li key={i} style={{ 
                    background: '#f8f9fa', 
                    padding: '0.75rem', 
                    marginBottom: '0.5rem',
                    borderRadius: '4px'
                  }}>
                    {answer}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Analytics;
