import React from "react";
import { useNavigate } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

import GuessNumber from "../assets/GuessNumber.jpg";
import Akshath from "../assets/QuizAkshat.jpg";
import shreya from "../assets/shreya.jpg";
import anaya from "../assets/Anaya.jpg";
import jaip from "../assets/Jaip.jpg";
import vihan from "../assets/Vihan.jpg"
import EmailSend from "../assets/emailsender.jpg"

import { Download } from "lucide-react";

export default function ProjectView() {
  const navigate = useNavigate();

  const handleViewMoreProjects = () => {
    navigate("/projects");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="font-semibold flex items-center text-teal-700 mb-3 -mt-6 text-3xl justify-center">
          Featured Projects by Kidzian's
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Featured Project Card */}
          <div className="bg-teal-700 rounded-2xl shadow-xl overflow-hidden mb-12">
            <div className="md:flex items-start">
              <div className="md:w-2/5 p-6">
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={GuessNumber}
                    alt="Guess the Number App"
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                 <div className="absolute top-4 right-4 bg-white -mt-4 font-extrabold text-sm text-black rounded-lg -px-4 py-2 text-sm font-bold shadow-lg flex items-center animate-blink gap-2 px-2">
  <Download className="w-4 h-4 " />  1000+
</div>

                </div>
              </div>

              <div className="md:w-3/5 p-6 md:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white text-2xl font-bold">GN</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Guess the Number</h1>
                    <p className="text-white text-lg">by Manaswin L</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-3 text-white font-medium">4.8 (120 reviews)</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Games</span>
                    <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Educational</span>
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Kids</span>
                  </div>
                </div>

                <p className="text-white text-lg leading-relaxed mb-8">
                  A fun and educational game developed by Kidzian student Manaswin L. Challenge yourself to guess the
                  correct number within a limited number of attempts. Perfect for improving logical thinking and number
                  skills.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://play.google.com/store/apps/developer?id=Kidzians"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                  >
                    Download App
                  </a>
                  <button
                    onClick={handleViewMoreProjects}
                    className="px-8 py-3 bg-white border-2 border-green-700 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-300"
                  >
                    View More Projects
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* More Projects Carousel */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">More Projects</h2>
            <Splide
              options={{
                type: "loop",
                perPage: 3,
                gap: "1rem",
                autoplay: true,
                pauseOnHover: true,
                arrows: true,
                pagination: false,
                breakpoints: {
                  1024: { perPage: 2 },
                  640: { perPage: 1 },
                },
              }}
            >
              {/* Card 1 */}
              <SplideSlide>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-[1.02]">
                  <div className="h-48 bg-blue-50 flex items-center justify-center">
                    <img src={Akshath} alt="Akshath" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Quiz Akshath</h3>
                    <p className="text-gray-600 leading-relaxed">
                      An interactive quiz app designed by Akshath for improving general knowledge.
                    </p>
                  </div>
                </div>
              </SplideSlide>

              {/* Card 2 */}
              <SplideSlide>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-[1.02]">
                  <div className="h-48 bg-pink-50 flex items-center justify-center">
                    <img src={shreya} alt="Shreya" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Simple Calculator</h3>
                    <p className="text-gray-600 leading-relaxed">
                     A Simple Calculator app devleoped by Shreya to calulate all basic arithmetic operations.
                    </p>
                  </div>
                </div>
              </SplideSlide>

              {/* Card 3 */}
              <SplideSlide>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-[1.02]">
                  <div className="h-48 bg-purple-50 flex items-center justify-center">
                    <img src={anaya} alt="Anaya" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Rock Paper Scissor</h3>
                    <p className="text-gray-600 leading-relaxed">
                     Rock Paper Scissor is a Fun Game developed by Anaya.
                    </p>
                  </div>
                </div>
              </SplideSlide>
              <SplideSlide>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-[1.02]">
                  <div className="h-48 bg-purple-50 flex items-center justify-center">
                    <img src={jaip} alt="jaip" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Volume Calculator</h3>
                    <p className="text-gray-600 leading-relaxed">
                     A Volume Calculator App using Kotlin. This app can calculate volume Sphere, Cone, Cube and Cuboid. This can be very valuable for Maths Students.
                    </p>
                  </div>
                </div>
              </SplideSlide>
              <SplideSlide>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-[1.02]">
                  <div className="h-48 bg-purple-50 flex items-center justify-center">
                    <img src={vihan} alt="vihan" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Chameleon</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Chameleon is a simple App developed by 7 year old boy that Changes colors like a Chameleon.
                    </p>
                  </div>
                </div>
              </SplideSlide>
              <SplideSlide>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-[1.02]">
                  <div className="h-48 bg-purple-50 flex items-center justify-center">
                    <img src={EmailSend} alt="Emailse" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Email-Sender</h3>
                    <p className="text-gray-600 leading-relaxed">
                    Simple App Which Make Email Services Easy.
                    </p>
                  </div>
                </div>
              </SplideSlide>
            </Splide>
          </div>
        </div>
      </div>
    </div>
  );
}
