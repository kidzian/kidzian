"use client"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const Gamified = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <div
      ref={ref}
      className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex flex-col lg:flex-row gap-10 p-6 md:p-10 items-center justify-center transition-colors duration-300"
    >
      {/* Image Section */}
      <motion.div
        className="w-full lg:w-2/5 flex justify-center"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -100 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative w-full max-w-lg">
          <div className="absolute -inset-1 bg-[#1E3A8A]/20 dark:bg-teal-500/20 rounded-3xl blur-lg"></div>
          <img
            src="https://images.pexels.com/photos/8535230/pexels-photo-8535230.jpeg"
            alt="Gamified learning"
            className="relative rounded-3xl w-full h-[45vh] lg:h-[70vh] object-cover shadow-xl"
          />
        </div>
      </motion.div>

      {/* Text Section */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-teal-700 dark:text-teal-400 text-3xl md:text-5xl 2xl:text-6xl font-bold mb-6 transition-colors duration-300">
            Learning Made Fun: A Gamified Approach
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed transition-colors duration-300">
            Transform learning into an exciting adventure! Our gamified approach keeps students engaged and motivated
            through interactive challenges, rewards, and hands-on activities.
          </p>

          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-[#1E3A8A] dark:border-teal-500 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-teal-700 dark:text-teal-400 font-bold text-xl mb-2 transition-colors duration-300">
                Interactive Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Engage with dynamic content and real-time feedback
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-[#1E3A8A] dark:border-teal-500 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-teal-700 dark:text-teal-400 font-bold text-xl mb-2 transition-colors duration-300">
                Achievement System
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Earn badges and rewards as you progress
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-[#1E3A8A] dark:border-teal-500 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-teal-700 dark:text-teal-400 font-bold text-xl mb-2 transition-colors duration-300">
                Progress Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Monitor your learning journey with detailed analytics
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Gamified
