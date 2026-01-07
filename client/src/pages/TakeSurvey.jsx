import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TakeSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [respondentInfo, setRespondentInfo] = useState({
    name: '',
    email: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchSurvey();
    checkLoginStatus();
  }, [id]);

  const checkLoginStatus = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setRespondentInfo({
        name: userData.name,
        email: userData.email
      });
    }
  };

  const fetchSurvey = async () => {
    try {
      const res = await axios.get(`/api/surveys/${id}`);
      setSurvey(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedAnswers = Object.keys(answers).map(questionId => ({
        questionId,
        answer: answers[questionId]
      }));

      const token = localStorage.getItem('token');
      const responseData = {
        surveyId: id,
        answers: formattedAnswers,
        respondentName: respondentInfo.name,
        respondentEmail: respondentInfo.email
      };

      const config = token ? {
        headers: { 'x-auth-token': token }
      } : {};

      await axios.post('/api/responses', responseData, config);

      setSubmitted(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!survey) return <div>Loading...</div>;

  if (submitted) {
    return (
      <div className="card">
        <div className="success">
          Thank you for your response! Redirecting...
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>{survey.title}</h1>
      <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>{survey.description}</p>

      <form onSubmit={handleSubmit}>
        {!isLoggedIn && (
          <div className="card" style={{ background: 'rgba(15, 52, 96, 0.6)', marginBottom: '1.5rem', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#00d4ff' }}>Your Information</h3>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={respondentInfo.name}
                onChange={(e) => setRespondentInfo({ ...respondentInfo, name: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={respondentInfo.email}
                onChange={(e) => setRespondentInfo({ ...respondentInfo, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
        )}

        {isLoggedIn && (
          <div className="card" style={{ background: 'rgba(81, 207, 102, 0.15)', marginBottom: '1.5rem', padding: '1rem', border: '1px solid rgba(81, 207, 102, 0.3)' }}>
            <p style={{ margin: 0, color: '#51cf66', fontWeight: '600' }}>
              ✓ Submitting as: <strong>{respondentInfo.name}</strong> ({respondentInfo.email})
            </p>
          </div>
        )}

        {survey.questions.map((question, index) => (
          <div key={question._id} className="card">
            <h3>Question {index + 1}</h3>
            <p style={{ marginBottom: '1rem' }}>{question.text}</p>

            {question.type === 'multiple-choice' && (
              <div>
                {question.options.map((option, i) => (
                  <div key={i} style={{ marginBottom: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        required
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'short-answer' && (
              <textarea
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            )}

            {question.type === 'rating' && (
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating}>
                    <input
                      type="radio"
                      id={`${question._id}-${rating}`}
                      name={question._id}
                      value={rating}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      required
                    />
                    <label htmlFor={`${question._id}-${rating}`}>{rating}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <button type="submit" className="btn btn-primary">
          Submit Response
        </button>
      </form>
    </div>
  );
}

export default TakeSurvey;
