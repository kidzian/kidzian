
import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'framer-motion'

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const faqRef = useRef(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index) // Toggle visibility
  }

  const faqData = [
    {
      question: 'What age group does Kidzian serve?',
      answer: 'Kidzian caters to children and teenagers aged 7 to 17 years. Our programs are designed to be age-appropriate and engaging, ensuring that students of all levels find learning fun and accessible.',
    },
    {
      question: 'How are Kidzian classes structured?',
      answer: 'Our classes are structured to be interactive and hands-on, with a focus on project-based learning. Students work on real-world projects and challenges that help them apply what they’ve learned in practical, meaningful ways.',
    },
    {
      question: 'How can parents track their child\'s progress at Kidzian?',
      answer: 'Parents can track their child’s progress through regular updates and reports provided by our instructors. We also offer parent-teacher meetings and showcase events where students can demonstrate their projects and achievements.',
    },
    {
      question: 'Do students need any prior coding experience to join Kidzian?',
      answer: 'No prior coding experience is required to join Kidzian. Our courses are designed to accommodate beginners as well as more advanced students. We provide a supportive learning environment where all students can thrive and advance at their own pace.',
    },
  ]

  // Function to check if the FAQ section is in view
  const checkVisibility = () => {
    const faqElement = faqRef.current
    if (faqElement) {
      const rect = faqElement.getBoundingClientRect()
      // Check if FAQ section is visible after scrolling 600vh
      setIsVisible(rect.top <= window.innerHeight && window.scrollY > 570)
    }
  }

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener('scroll', checkVisibility)

    // Cleanup event listener
    return () => {
      window.removeEventListener('scroll', checkVisibility)
    }
  }, [])

  return (
    <div className="w-full h-[75vh] flex items-center justify-center flex-col p-5 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

      {/* FAQ List with scroll-triggered animation */}
      <ul ref={faqRef} className="flex flex-col gap-3 w-full max-w-[800px]">
        {faqData.map((faq, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: isVisible ? 1 : 0,  // Animation triggers when FAQ section is visible
              y: isVisible ? 0 : -20,
            }}
            transition={{
              delay: index * 0.1, // Slight delay for each FAQ
              duration: 0.6, // Duration for smooth animation
            }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col bg-white shadow-md rounded-md w-full p-4 cursor-pointer"
            onClick={() => toggleFAQ(index)}
            whileHover={{
              backgroundColor: '#f7fafc', // Light gray-blue background on hover
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow on hover
              transition: { type: 'spring', stiffness: 300, damping: 20 }, // Smooth transition
            }}
            whileTap={{ scale: 0.98 }} // Slight shrink effect on tap
          >
            <div className="flex justify-between items-center">
              <span className="text-lg">{faq.question}</span>
              <span className="text-xl">
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </span>
            </div>

            {/* Glide Effect for Answer Section */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: openIndex === index ? 'auto' : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-2"
            >
              {openIndex === index && (
                <p className="text-gray-700">{faq.answer}</p>
              )}
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export default Faq
