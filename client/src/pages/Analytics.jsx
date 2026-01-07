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

  useEffect(() => {
    fetchAnalytics();
    fetchSurvey();
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
