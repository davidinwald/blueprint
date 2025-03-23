import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/fetcher";
import Notification from "./Notification/Notification";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import "./Screener.css";

const MINIMUM_ANSWER_TIME = 1000; // 1 second minimum between answers

const Screener = () => {
  const [screenerData, setScreenerData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAnswerTime, setLastAnswerTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const resetForm = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowSuccess(false);
    setLastAnswerTime(0);
  };

  useEffect(() => {
    const fetchScreener = async () => {
      try {
        const response = await api.getScreener();
        if (
          !response.data ||
          !response.data.content ||
          !response.data.content.sections
        ) {
          throw new Error("Invalid screener data format");
        }
        setScreenerData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load screener questions");
        setIsLoading(false);
      }
    };

    fetchScreener();
  }, []);

  // Hide warning notification after 2 seconds
  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => {
        setShowWarning(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showWarning]);

  const handleAnswer = async (value) => {
    const now = Date.now();
    const timeSinceLastAnswer = now - lastAnswerTime;

    // Check if user is answering too quickly
    if (timeSinceLastAnswer < MINIMUM_ANSWER_TIME && lastAnswerTime !== 0) {
      setShowWarning(true);
      return;
    }

    if (!screenerData?.content?.sections?.[0]?.questions) {
      setError("Invalid screener data");
      return;
    }

    const questions = screenerData.content.sections[0].questions;
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      setError("Question not found");
      return;
    }

    const newAnswer = {
      value,
      question_id: currentQuestion.question_id,
    };

    // Update last answer time
    setLastAnswerTime(now);

    // If we're modifying a previous answer, update it in place
    if (currentQuestionIndex < answers.length) {
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = newAnswer;
      setAnswers(updatedAnswers);
    } else {
      setAnswers([...answers, newAnswer]);
    }

    if (currentQuestionIndex === questions.length - 1) {
      // Last question - submit answers
      setIsSubmitting(true);
      try {
        const finalAnswers =
          currentQuestionIndex < answers.length
            ? answers
            : [...answers, newAnswer];
        const response = await api.submitScreener(finalAnswers);
        console.log("Submission response:", response.data);
        setShowSuccess(true);
        // Reset form after 2 seconds
        setTimeout(() => {
          resetForm();
        }, 2000);
      } catch (err) {
        setError(err.message || "Failed to submit answers");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Get the previously selected answer for the current question
  const getCurrentAnswer = () => {
    if (currentQuestionIndex < answers.length) {
      return answers[currentQuestionIndex].value;
    }
    return null;
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="screener-error">{error}</div>;
  if (!screenerData?.content?.sections?.[0])
    return <div className="screener-error">Invalid screener format</div>;

  const section = screenerData.content.sections[0];
  if (!section.questions?.length || !section.answers?.length) {
    return <div className="screener-error">Missing questions or answers</div>;
  }

  const totalQuestions = section.questions.length;
  const currentQuestion = section.questions[currentQuestionIndex];
  if (!currentQuestion) {
    return <div className="screener-error">Question not found</div>;
  }

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const currentAnswer = getCurrentAnswer();

  return (
    <div className="screener-container">
      {showSuccess && (
        <Notification
          type="success"
          message="Assessment submitted successfully! Starting new assessment..."
        />
      )}
      {error && <Notification type="error" message={error} />}
      {showWarning && (
        <Notification
          type="warning"
          message="Please take your time to read and answer each question carefully."
        />
      )}

      <div className="screener-header">
        <h1>{screenerData.content.display_name || "Screener"}</h1>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="question-counter">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </p>
      </div>

      <div className="screener-content">
        <div className="section-title">
          {section.title || "Please answer the following questions"}
        </div>
        <div className="question-title">{currentQuestion.title}</div>

        <div className="answer-options">
          {section.answers.map((answer) => (
            <button
              key={answer.value}
              className={`answer-button ${
                currentAnswer === answer.value ? "selected" : ""
              }`}
              onClick={() => handleAnswer(answer.value)}
              disabled={isSubmitting || showSuccess}
            >
              {answer.title}
            </button>
          ))}
        </div>

        <div className="navigation-buttons">
          {currentQuestionIndex > 0 && (
            <button
              className="back-button"
              onClick={handleBack}
              disabled={isSubmitting || showSuccess}
            >
              ← Back
            </button>
          )}
        </div>

        {isSubmitting && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default Screener;
