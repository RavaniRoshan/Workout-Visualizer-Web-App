import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  const [motivation, setMotivation] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  
  // Refs for animation targets
  const titleRef = useRef(null);
  const motivationRef = useRef(null);
  const exercisesRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
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
      targets: exercisesRef.current.querySelectorAll('.exercise-card'),
      translateX: [-50, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeOutCubic'
    });
  }, []);

  useEffect(() => {
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
      setMotivation('');
      
      // Animate the button while loading
      anime({
        targets: '.motivation-button',
        scale: [1, 0.95],
        duration: 200,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });

      const prompt = "Give me a short, inspiring motivational quote or message (1-2 sentences) for an agile, athletic workout. Focus on discipline, consistency, and a lean, powerful physique like Tom Cruise in action movies. Use an encouraging and confident tone.";
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      
      if (!apiKey) {
        throw new Error('API key is not configured. Please set up your API key in the environment variables.');
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      let response;
      let result;
      for (let i = 0; i < 3; i++) { // Exponential backoff with 3 retries
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.status !== 429) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setMotivation(result.candidates[0].content.parts[0].text);
      } else {
        setMotivation("Failed to get a motivational message. Please try again.");
      }
    } catch (error) {
      console.error('Error fetching motivational message:', error);
      setMotivation("Failed to get a motivational message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exercises = {
    warmup: [
      {
        name: "Jumping Jacks",
        howTo: "Start with your feet together and arms at your sides. Jump your feet out to the side while raising your arms overhead. Jump back to the start.",
        reps: "30-60 seconds",
        imagePrompt: "JUMPING\nJACKS"
      },
      {
        name: "High Knees",
        howTo: "Run in place, bringing your knees up high towards your chest. Keep your core engaged and pump your arms.",
        reps: "30-60 seconds",
        imagePrompt: "HIGH\nKNEES"
      },
      {
        name: "Butt Kicks",
        howTo: "Run in place, kicking your heels back to your glutes. Keep your upper body stable and focus on quick, light footwork.",
        reps: "30-60 seconds",
        imagePrompt: "BUTT\nKICKS"
      },
      {
        name: "Arm Circles",
        howTo: "Stand with your feet shoulder-width apart. Extend your arms out to the sides and make small circles, then gradually increase the size. Go forward for 30 seconds, then backward for 30 seconds.",
        reps: "30-60 seconds",
        imagePrompt: "ARM\nCIRCLES"
      }
    ],
    strength: [
      {
        name: "Dumbbell Step-Ups",
        howTo: "Hold a dumbbell in each hand. Find a sturdy step or bench. Step up with one foot, driving the other knee up. Step back down with control and repeat on the other side.",
        imagePrompt: "STEP-UPS",
        sets: 3,
        reps: "10-12 per leg"
      },
      {
        name: "Push-ups",
        howTo: "Start in a plank position. Lower your chest toward the floor, keeping your body in a straight line. Push back up. Modify by doing them on your knees if needed.",
        imagePrompt: "PUSH-UPS",
        sets: 3,
        reps: "As many as you can do with good form (AMRAP)"
      },
      {
        name: "Dumbbell Tricep Kickbacks",
        howTo: "Hold a dumbbell in one hand. Hinge at your waist, keeping your back straight. With your elbow bent and close to your body, extend your arm straight back, squeezing your triceps. Lower and repeat.",
        imagePrompt: "TRICEP\nKICKBACKS",
        sets: 3,
        reps: "10-12 per side"
      },
      {
        name: "Dumbbell Bicep Curls",
        howTo: "Hold a dumbbell in each hand with your palms facing forward. Keep your elbows close to your body and curl the dumbbells up toward your shoulders. Lower with control.",
        imagePrompt: "BICEP\nCURLS",
        sets: 3,
        reps: "10-12 reps per arm"
      },
      {
        name: "Plank",
        howTo: "Hold a plank position on your forearms or hands, with your body in a straight line from head to heels. Keep your core tight and don't let your hips sag.",
        imagePrompt: "PLANK",
        sets: 3,
        reps: "45-60 seconds"
      }
    ],
    cooldown: [
      {
        name: "Quad Stretch",
        howTo: "Stand and pull one foot back toward your glute. Use a wall for balance if needed. Hold for 30 seconds on each leg.",
        reps: "30 seconds per leg",
        imagePrompt: "QUAD\nSTRETCH"
      },
      {
        name: "Hamstring Stretch",
        howTo: "Sit on the floor with one leg straight and the other bent. Lean forward from your hips and reach for your toes. Hold for 30 seconds on each leg.",
        reps: "30 seconds per leg",
        imagePrompt: "HAMSTRING\nSTRETCH"
      },
      {
        name: "Chest Stretch",
        howTo: "Clasp your hands behind your back and gently lift them to open your chest. Hold for 30 seconds.",
        reps: "30 seconds",
        imagePrompt: "CHEST\nSTRETCH"
      },
      {
        name: "Triceps Stretch",
        howTo: "Raise one arm overhead and bend at the elbow, pulling it gently with your other hand. Hold for 30 seconds on each arm.",
        reps: "30 seconds per arm",
        imagePrompt: "TRICEPS\nSTRETCH"
      }
    ],
  };

  const ExerciseCard = ({ exercise }) => {
    const cardRef = useRef(null);
    const [imageError, setImageError] = useState(false);

    const generatePlaceholderImageUrl = (text) => {
      const encodedText = encodeURIComponent(text.toUpperCase().replace(/\s/g, '\n'));
      return `https://placehold.co/150x150/e2e8f0/1a202c?text=${encodedText}`;
    };
  
    const imageUrl = generatePlaceholderImageUrl(exercise.imagePrompt);

    const handleDetailsClick = () => {
      anime({
        targets: cardRef.current.querySelector('.details-content'),
        height: ['0px', 'auto'],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutCubic'
      });
    };
  
    return (
      <div ref={cardRef} className="exercise-card bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200 transform hover:scale-102 transition-transform duration-200"
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
           }}>
        <h3 className="text-xl font-bold text-gray-800">{exercise.name}</h3>
        {imageUrl && (
          <img src={imageUrl} alt={exercise.name} className="my-4 rounded-lg shadow-inner" />
        )}
        <details className="mt-2">
          <summary className="font-semibold text-blue-600 cursor-pointer hover:text-blue-800">
            How-to & Details
          </summary>
          <div className="mt-2 text-gray-700">
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

        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Daily Motivation</h2>
            <button
              onClick={getMotivationalMessage}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Get a Motivational Message ✨'}
            </button>
            {motivation && (
              <p className="mt-4 text-center text-gray-700 italic">"{motivation}"</p>
            )}
          </div>

          <Section title="1. Warm-up (5 minutes)" exercises={exercises.warmup} />
          <Section title="2. Strength & Core Circuit (25 minutes)" exercises={exercises.strength} />
          <Section title="3. Cool-down (5 minutes)" exercises={exercises.cooldown} />
        </div>
      </div>
    </div>
  );
};

export default App;
