import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const res = await axios.get('/api/surveys');
      setSurveys(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Available Surveys</h1>
      <div className="survey-grid">
        {surveys.map((survey) => (
          <div key={survey._id} className="survey-card">
            <h3>{survey.title}</h3>
            <p>{survey.description}</p>
            <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
              {survey.questions.length} questions
            </p>
            <Link to={`/survey/${survey._id}`}>
              <button className="btn btn-primary">Take Survey</button>
            </Link>
          </div>
        ))}
      </div>
      {surveys.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#7f8c8d' }}>
          No surveys available yet
        </p>
      )}
    </div>
  );
}

export default Home;
