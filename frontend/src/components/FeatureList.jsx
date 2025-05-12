"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

const features = [
  "Expert-led interactive classes",
  "Project-based learning approach",
  "Personalized learning path"
]

export default function FeatureList() {
  return (
    <div className="space-y-3">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
          <p>{feature}</p>
        </motion.div>
      ))}
    </div>
  )
}