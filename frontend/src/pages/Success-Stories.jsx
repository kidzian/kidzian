"use client"
import { motion } from "framer-motion"
import { Trophy, ArrowRight, Award, Users, Clock, Briefcase } from "lucide-react"

const SuccessStories = () => {
  const achievements = [
    {
      title: "From Beginner to Senior Developer",
      student: "Michael Chen",
      age: "28",
      description:
        "Completed our Full-Stack Development track and landed a senior role at a Fortune 500 tech company within 8 months.",
      image: "/placeholder.svg?height=400&width=600",
      achievement: "Career Transition",
      category: "Web Development",
    },
    {
      title: "Cybersecurity Certification Success",
      student: "Sarah Johnson",
      age: "34",
      description:
        "Earned CISSP certification after completing our Advanced Cybersecurity program while working full-time.",
      image: "/placeholder.svg?height=400&width=600",
      achievement: "Professional Certification",
      category: "Cybersecurity",
    },
    {
      title: "Data Science Portfolio Recognition",
      student: "Raj Patel",
      age: "31",
      description:
        "Created an award-winning data visualization project that led to a data scientist position at a leading analytics firm.",
      image: "/placeholder.svg?height=400&width=600",
      achievement: "Industry Recognition",
      category: "Data Science",
    },
  ]

  const stats = [
    {
      icon: Users,
      value: "45,000+",
      label: "Active Professionals",
      description: "Advancing their careers with us",
    },
    {
      icon: Briefcase,
      value: "89%",
      label: "Job Placement Rate",
      description: "Within 6 months of completion",
    },
    {
      icon: Award,
      value: "250+",
      label: "Industry Partners",
      description: "Recognizing our certifications",
    },
    {
      icon: Clock,
      value: "94%",
      label: "Completion Rate",
      description: "Professionals finishing courses",
    },
  ]

  const testimonials = [
    {
      name: "Jennifer Martinez",
      position: "Product Manager at TechCorp",
      image: "/placeholder.svg?height=200&width=200",
      quote:
        "The project-based curriculum gave me practical experience that I could immediately apply in my role. The mentorship was invaluable for my career growth.",
      previousRole: "Marketing Specialist",
    },
    {
      name: "David Wilson",
      position: "Cloud Solutions Architect",
      image: "/placeholder.svg?height=200&width=200",
      quote:
        "After 12 years in IT support, I was able to transition to cloud architecture thanks to the specialized AWS certification track. The ROI on this program has been tremendous.",
      previousRole: "IT Support Manager",
    },
  ]

  const careerTransitions = [
    { from: "Teacher", to: "UX Designer", increase: "85%" },
    { from: "Sales Rep", to: "Data Analyst", increase: "62%" },
    { from: "Admin Assistant", to: "Full-Stack Developer", increase: "112%" },
    { from: "Retail Manager", to: "Product Manager", increase: "73%" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 opacity-90" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/placeholder.svg?height=1080&width=1920")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Real Career Transformations
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            See how professionals like you have accelerated their careers through our industry-recognized learning
            programs
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-12 h-12 text-slate-700 mb-4" />
                <h3 className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</h3>
                <p className="text-lg font-semibold text-slate-800 mb-2">{stat.label}</p>
                <p className="text-slate-600">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Transitions */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-6">Salary Increases After Completion</h2>
          <p className="text-xl text-center text-slate-600 max-w-3xl mx-auto mb-16">
            Our graduates report significant salary increases after completing our programs and transitioning to new
            roles
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {careerTransitions.map((transition, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-slate-500 mb-2">{transition.from}</div>
                  <ArrowRight className="w-8 h-8 text-slate-400 my-2" />
                  <div className="text-xl font-bold text-slate-800 mb-4">{transition.to}</div>
                  <div className="text-3xl font-bold text-emerald-600">+{transition.increase}</div>
                  <div className="text-slate-500 mt-2">Salary Increase</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-6">Success Stories</h2>
          <p className="text-xl text-center text-slate-600 max-w-3xl mx-auto mb-16">
            Real professionals who transformed their careers through our platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative h-48">
                  <img
                    src={achievement.image || "/placeholder.svg"}
                    alt={achievement.student}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-semibold">{achievement.achievement}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">
                      {achievement.category}
                    </span>
                    <span className="text-slate-600 text-sm">Age {achievement.age}</span>
                  </div>
                  <p className="text-slate-700 mb-4">{achievement.description}</p>
                  <p className="text-slate-900 font-semibold">{achievement.student}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">What Our Graduates Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-6 mb-6">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-200"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{testimonial.name}</h3>
                    <p className="text-emerald-600 font-medium">{testimonial.position}</p>
                    <p className="text-slate-500 text-sm">Previously: {testimonial.previousRole}</p>
                  </div>
                </div>
                <p className="text-slate-700 text-lg italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured In Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-slate-700 mb-12">As Featured In</h2>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {["Forbes", "TechCrunch", "Wall Street Journal", "Business Insider", "Fast Company"].map(
              (company, index) => (
                <motion.div
                  key={index}
                  className="text-slate-400 text-xl font-bold"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {company}
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Write Your Success Story?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join our community of professionals and accelerate your career with industry-recognized certifications
          </p>
          <motion.button
            onClick={() => (window.location.href = "/courses")}
            className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 hover:bg-emerald-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Programs <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  )
}

export default SuccessStories