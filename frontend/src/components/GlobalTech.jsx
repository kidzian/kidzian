import React, { useState, useEffect, useRef } from "react";

const Counter = ({ target, duration, trigger, isDecimal = false }) => {
  const [count, setCount] = useState(0);

//   useEffect(() => {
//     if (!trigger) return;

//     let start = 0;
//     const increment = isDecimal ? 0.1 : target / (duration / 10); // Increment for decimals or regular step size
//     const totalSteps = Math.ceil(duration / 10);

//     const timer = setInterval(() => {
//       start += increment;
//       const roundedValue = isDecimal
//         ? Math.min(target, parseFloat(start.toFixed(1))) // Ensure decimal precision
//         : Math.min(target, Math.ceil(start)); // Ensure the final value matches

//       setCount(roundedValue);

//       if (--totalSteps <= 0) {
//         clearInterval(timer);
//         setCount(target); // Ensure the final value is exact
//       }
//     }, 10);

//     return () => clearInterval(timer);
//   }, [target, duration, trigger, isDecimal]);

//   return <>{count}</>;
// };

useEffect(() => {
  if (!trigger) return;

  let start = 0;
  const increment = isDecimal ? 0.1 : target / (duration / 10); // Increment for decimals or regular step size
  const totalSteps = Math.ceil(duration / 10);

  const timer = setInterval(() => {
    start += increment;
    const roundedValue = isDecimal
      ? Math.min(target, parseFloat(start.toFixed(1))) // Ensure decimal precision
      : Math.min(target, Math.ceil(start)); // Ensure the final value matches

    setCount(roundedValue);

    // if (totalSteps-- <= 0) { // Corrected here
    //   clearInterval(timer);
    //   setCount(target); // Ensure the final value is exact
    // }
  }, 10);

  return () => clearInterval(timer);
}, [target, duration, trigger, isDecimal]);

return <>{count}</>;
};


const GlobalTech = () => {
  const [visible, setVisible] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the component is visible
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  const duration = 550; // Shared duration for all counters

  return (
    <div
      ref={componentRef}
      className="w-full  bg-[#ffffff] flex flex-col items-center justify-center"
    >
      <h1 className="text-4xl font-bold text-teal-700 text-center ">
        Global Tech School for Children
      </h1>

      <div className="sm:w-[90vw] w-full md:flex lg:flex xl:flex 2xl:flex md:flex-wrap sm:block items-center justify-center gap-10">
        {/* Reviews Section */}
        <div className="text-teal-700 h-[40vh] md:w-[18vw] sm:w-[90vw] rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-5xl font-bold">
              {visible && (
                <Counter
                  target={4.9}
                  duration={duration}
                  trigger={visible}
                  isDecimal={true} // Enable decimal increments
                />
              )}
              +
            </h2>
            <h2 className="text-2xl font-bold text-[#231639]">Google Reviews</h2>
          </div>
        </div>

        {/* Enrolled Students Section */}
        <div className="text-teal-700 h-[40vh] md:w-[18vw] sm:w-[90vw] rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-5xl font-bold">
              {visible && <Counter target={1114} duration={duration} trigger={visible} />}
            </h2>
            <h2 className="text-2xl font-bold text-[#231639]">
              Enrolled Students
            </h2>
          </div>
        </div>

        {/* IT Expert Mentors Section */}
        <div className="text-teal-700 h-[40vh] md:w-[18vw] sm:w-[90vw] rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-5xl font-bold">
              {visible && <Counter target={102} duration={duration} trigger={visible} />}+
            </h2>
            <h2 className="text-2xl font-bold text-[#231639]">
              IT Expert Mentors
            </h2>
          </div>
        </div>

        {/* Completed Sessions Section */}
        <div className="text-teal-700 h-[40vh] md:w-[18vw] sm:w-[90vw] rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-5xl font-bold">
              {visible && <Counter target={3120} duration={duration} trigger={visible} />}
            </h2>
            <h2 className="text-2xl font-bold text-[#231639]">
              Completed Sessions
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTech;
