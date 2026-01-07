import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TakeSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchSurvey();
  }, [id]);

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

      await axios.post('/api/responses', {
        surveyId: id,
        answers: formattedAnswers
      });

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
