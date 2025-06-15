"use client"

import { useState, useEffect, useRef } from "react"

// Counter Component
const Counter = ({ target, duration, trigger, isDecimal = false }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return

    let start = 0
    const increment = isDecimal ? 0.1 : target / (duration / 10)

    const timer = setInterval(() => {
      start += increment
      const roundedValue = isDecimal
        ? Math.min(target, Number.parseFloat(start.toFixed(1)))
        : Math.min(target, Math.ceil(start))

      setCount(roundedValue)

      if (roundedValue >= target) {
        clearInterval(timer)
      }
    }, 10)

    return () => clearInterval(timer)
  }, [target, duration, trigger, isDecimal])

  return <>{count}</>
}

// GlobalTech Section
const GlobalTech = () => {
  const [visible, setVisible] = useState(false)
  const componentRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (componentRef.current) {
      observer.observe(componentRef.current)
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current)
      }
    }
  }, [])

  const duration = 600

  return (
    <div
      ref={componentRef}
      className="w-full bg-gradient-to-b from-white to-teal-50 dark:from-gray-900 dark:to-gray-800 py-20 flex flex-col items-center justify-center transition-colors duration-300"
    >
      <h1 className="text-5xl font-bold text-teal-700 dark:text-teal-400 text-center mb-14 drop-shadow-lg">
        Global Tech School for Children
      </h1>

      <div className="w-[90%] flex flex-wrap gap-10 justify-center">
        {[
          {
            value: 4.9,
            label: "Google Reviews",
            isDecimal: true,
            suffix: "+",
            icon: "⭐",
          },
          {
            value: 1114,
            label: "Enrolled Students",
            icon: "🎓",
          },
          {
            value: 102,
            label: "IT Expert Mentors",
            suffix: "+",
            icon: "👨‍💻",
          },
          {
            value: 3120,
            label: "Completed Sessions",
            icon: "📚",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="text-teal-800 dark:text-teal-300 bg-white dark:bg-gray-800 shadow-xl hover:scale-105 transition duration-300 rounded-3xl w-[270px] h-[270px] flex items-center justify-center p-4 border border-teal-100 dark:border-teal-700"
          >
            {/* Inner Box */}
            <div className="w-full h-full bg-gradient-to-br from-teal-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-inner flex flex-col items-center justify-center p-6 border border-teal-200 dark:border-teal-600">
              <div className="text-4xl mb-2">{item.icon}</div>
              <h2 className="text-5xl font-extrabold mb-3 text-teal-800 dark:text-teal-300">
                {visible && (
                  <Counter target={item.value} duration={duration} trigger={visible} isDecimal={item.isDecimal} />
                )}
                {item.suffix || ""}
              </h2>
              <h3 className="text-xl font-semibold text-[#231639] dark:text-gray-200 text-center">{item.label}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GlobalTech
