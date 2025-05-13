import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Code } from 'lucide-react';

const stories = {
  rashmi: {
    name: 'Rashmi Raju',
    role: 'Founder & Visionary',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    award: 'Most Inspiring Young Woman Educationist - 2025',
    organization: 'Femmetimes',
    icon: Trophy,
    color: 'teal',
    story: `Rashmi Raju's journey in tech education began with a vision to make coding accessible and engaging for young minds. As the founder of Kidzian, she has transformed how children learn technology, impacting over 10,000 students globally.

Her innovative approach combines project-based learning with real-world applications, helping students develop not just coding skills, but also critical thinking and problem-solving abilities.

Under her leadership, Kidzian has grown from a small coding club to a global educational platform, earning recognition from leading tech companies and educational institutions.`,
    achievements: [
      'Founded Kidzian - Global Tech Education Platform',
      'Developed innovative tech curriculum for ages 7-17',
      'Featured in Forbes 30 Under 30 - Education Category',
      'TEDx Speaker on "Revolutionizing Tech Education"',
      'Winner of Global EdTech Startup Award 2024'
    ],
    impact: [
      { metric: '10,000+', label: 'Students Impacted' },
      { metric: '15+', label: 'International Awards' },
      { metric: '25+', label: 'Countries Reached' },
      { metric: '95%', label: 'Student Success Rate' }
    ]
  },
  manaswin: {
    name: 'Manaswin L',
    role: 'App Development Prodigy',
    image: 'https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    award: 'Young App Developer of the Year',
    organization: 'Google Play',
    icon: Code,
    color: 'blue',
    story: `At just 15, Manaswin L has already made his mark in the tech world with his innovative "Guess the Number" game. What started as a simple project during his coding classes at Kidzian has evolved into a successful app with over 1,000 downloads on the Google Play Store.

His journey showcases how young minds can transform their programming knowledge into real-world applications that engage and entertain users globally.`,
    achievements: [
      'Developed "Guess the Number" mobile game',
      'Featured on Google Play Store',
      'Winner of Young Innovator Award 2024',
      'Mentors junior coding students'
    ],
    impact: [
      { metric: '1,000+', label: 'App Downloads' },
      { metric: '4.8/5', label: 'User Rating' },
      { metric: '50+', label: 'Countries Reached' },
      { metric: '15+', label: 'App Updates' }
    ]
  }
};

const ViewStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const story = stories[id];

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-teal-800 mb-4">Story not found</h1>
          <button
            onClick={() => navigate('/success-stories')}
            className="inline-flex items-center gap-2 text-teal-800 hover:text-teal-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Success Stories
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = story.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={story.image}
            alt={story.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <button
                onClick={() => navigate('/success-stories')}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Success Stories
              </button>
              <h1 className="text-5xl font-bold text-white mb-4">{story.name}</h1>
              <div className="flex items-center gap-3 text-white/90 mb-6">
                <IconComponent className="w-6 h-6" />
                <span className="text-xl">{story.role}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 inline-block">
                <p className="text-xl font-semibold text-white mb-2">{story.award}</p>
                <p className="text-white/80">Awarded by {story.organization}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Story */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-teal-800 mb-6">The Story</h2>
            <div className="prose prose-lg">
              {story.story.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4">{paragraph}</p>
              ))}
            </div>
          </motion.section>

          {/* Achievements */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-teal-800 mb-6">Key Achievements</h2>
            <ul className="space-y-4">
              {story.achievements.map((achievement, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <span className="text-gray-700">{achievement}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Impact */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {story.impact.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <p className="text-3xl font-bold text-teal-800 mb-2">{item.metric}</p>
                <p className="text-gray-600">{item.label}</p>
              </div>
            ))}
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default ViewStory;
