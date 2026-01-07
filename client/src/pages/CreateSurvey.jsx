import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateSurvey() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'multiple-choice',
    options: ['']
  });
  const navigate = useNavigate();

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, '']
    });
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (currentQuestion.text) {
      const questionToAdd = { ...currentQuestion };
      if (currentQuestion.type === 'short-answer' || currentQuestion.type === 'rating') {
        questionToAdd.options = [];
      }
      setQuestions([...questions, questionToAdd]);
      setCurrentQuestion({ text: '', type: 'multiple-choice', options: [''] });
    }
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/surveys', 
        { title, description, questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/my-surveys');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Create Survey</h1>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="form-group">
            <label>Survey Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <h3>Add Question</h3>
          <div className="form-group">
            <label>Question Text</label>
            <input
              type="text"
              value={currentQuestion.text}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Question Type</label>
            <select
              value={currentQuestion.type}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value })}
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="short-answer">Short Answer</option>
              <option value="rating">Rating (1-5)</option>
            </select>
          </div>

          {currentQuestion.type === 'multiple-choice' && (
            <div className="form-group">
              <label>Options</label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addOption} className="btn btn-secondary">
                Add Option
              </button>
            </div>
          )}

          <button type="button" onClick={addQuestion} className="btn btn-primary">
            Add Question
          </button>
        </div>

        {questions.length > 0 && (
          <div className="card">
            <h3>Questions ({questions.length})</h3>
            {questions.map((q, index) => (
              <div key={index} className="question-item">
                <div className="question-header">
                  <strong>{q.text}</strong>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Type: {q.type}</p>
                {q.options.length > 0 && (
                  <ul className="options-list">
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={questions.length === 0}>
          Create Survey
        </button>
      </form>
    </div>
  );
}

export default CreateSurvey;
