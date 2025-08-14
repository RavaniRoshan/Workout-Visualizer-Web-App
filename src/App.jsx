import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  const [motivation, setMotivation] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState(null);
  
  // Refs for animation targets
  const titleRef = useRef(null);
  const motivationRef = useRef(null);
  const exercisesRef = useRef(null);

  useEffect(() => {
    // Animate title on mount
    anime({
      targets: titleRef.current,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutElastic(1, .8)'
    });

    // Animate exercise cards
    anime({
      targets: '.exercise-card',
      translateX: [-50, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeOutCubic'
    });

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getMotivationalMessage = async () => {
    try {
      setLoading(true);
      setError(null);
      setMotivation('');
      
      // Animate the button while loading
      const buttonAnimation = anime({
        targets: '.motivation-button',
        scale: [1, 0.95],
        duration: 200,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });

      const prompt = "Give me a short, inspiring motivational quote or message (1-2 sentences) for an agile, athletic workout. Focus on discipline, consistency, and a lean, powerful physique like Tom Cruise in action movies. Use an encouraging and confident tone.";
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      
      if (!apiKey) {
        throw new Error('API key is not configured. Please set up your API key in the environment variables.');
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      let response;
      for (let i = 0; i < 3; i++) {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (response.status !== 429) break;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        setMotivation(result.candidates[0].content.parts[0].text);
        // Animate the motivation text appearance
        anime({
          targets: motivationRef.current,
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 800,
          easing: 'easeOutCubic'
        });
      } else {
        throw new Error("Couldn't generate a motivational message. Please try again.");
      }
    } catch (error) {
      console.error('Error fetching motivational message:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      // Stop the button animation
      anime.remove('.motivation-button');
      anime({
        targets: '.motivation-button',
        scale: 1,
        duration: 200,
        easing: 'easeOutCubic'
      });
    }
  };

  // Rest of your existing exercises data...

  const ExerciseCard = ({ exercise }) => {
    const cardRef = useRef(null);
    const [imageError, setImageError] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const generatePlaceholderImageUrl = (text) => {
      const encodedText = encodeURIComponent(text.toUpperCase().replace(/\s/g, '\n'));
      return `https://placehold.co/150x150/e2e8f0/1a202c?text=${encodedText}`;
    };
  
    const imageUrl = generatePlaceholderImageUrl(exercise.imagePrompt);

    const handleDetailsClick = () => {
      setIsExpanded(!isExpanded);
      anime({
        targets: cardRef.current.querySelector('.details-content'),
        height: [isExpanded ? 'auto' : '0px', isExpanded ? '0px' : 'auto'],
        opacity: isExpanded ? [1, 0] : [0, 1],
        duration: 400,
        easing: 'easeOutCubic'
      });
    };
  
    return (
      <div 
        ref={cardRef}
        className="exercise-card bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200 transform hover:scale-102 transition-transform duration-200"
        onMouseEnter={() => {
          anime({
            targets: cardRef.current,
            scale: 1.02,
            duration: 200,
            easing: 'easeOutCubic'
          });
        }}
        onMouseLeave={() => {
          anime({
            targets: cardRef.current,
            scale: 1,
            duration: 200,
            easing: 'easeOutCubic'
          });
        }}
      >
        <h3 className="text-xl font-bold text-gray-800">{exercise.name}</h3>
        {imageUrl && !imageError && (
          <img
            src={imageUrl}
            alt={exercise.name}
            className="my-4 rounded-lg shadow-inner"
            onError={() => setImageError(true)}
          />
        )}
        <details
          className="mt-2"
          onClick={(e) => {
            e.preventDefault();
            handleDetailsClick();
          }}
        >
          <summary className="font-semibold text-blue-600 cursor-pointer hover:text-blue-800">
            How-to & Details
          </summary>
          <div className="details-content mt-2 text-gray-700" style={{ height: 0, opacity: 0, overflow: 'hidden' }}>
            <p className="mb-2"><strong>How-to:</strong> {exercise.howTo}</p>
            {exercise.sets && <p className="mb-1"><strong>Sets:</strong> {exercise.sets}</p>}
            <p><strong>Reps/Duration:</strong> {exercise.reps}</p>
          </div>
        </details>
      </div>
    );
  };

  const Section = ({ title, exercises }) => {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="mt-4">
          {exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <h1 ref={titleRef} className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-2 opacity-0">
            Workout Visualizer
          </h1>
          <p className="text-center text-lg text-gray-600 mb-6">{getGreeting()}! Your workout awaits.</p>

          <div ref={exercisesRef} className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Daily Motivation</h2>
              <button
                onClick={getMotivationalMessage}
                className="motivation-button w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Get a Motivational Message ✨'}
              </button>
              {error ? (
                <p className="mt-4 text-center text-red-600">{error}</p>
              ) : motivation && (
                <p ref={motivationRef} className="mt-4 text-center text-gray-700 italic opacity-0">
                  "{motivation}"
                </p>
              )}
            </div>

            <Section title="1. Warm-up (5 minutes)" exercises={exercises.warmup} />
            <Section title="2. Strength & Core Circuit (25 minutes)" exercises={exercises.strength} />
            <Section title="3. Cool-down (5 minutes)" exercises={exercises.cooldown} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
