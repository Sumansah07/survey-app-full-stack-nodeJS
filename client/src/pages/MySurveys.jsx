import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function MySurveys() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    fetchMySurveys();
  }, []);

  const fetchMySurveys = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/surveys/my-surveys', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSurveys(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSurvey = async (id) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/surveys/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMySurveys();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1>My Surveys</h1>
      <div className="survey-grid">
        {surveys.map((survey) => (
          <div key={survey._id} className="survey-card">
            <h3>{survey.title}</h3>
            <p>{survey.description}</p>
            <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
              {survey.questions.length} questions
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <Link to={`/analytics/${survey._id}`}>
                <button className="btn btn-primary">View Analytics</button>
              </Link>
              <button
                onClick={() => deleteSurvey(survey._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {surveys.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#7f8c8d' }}>
          You haven't created any surveys yet
        </p>
      )}
    </div>
  );
}

export default MySurveys;
