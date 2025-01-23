import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BlogTile = ({ blog }) => {
  const cardAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="group"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={cardAnimation}
    >
      <a  href={`/blog/${blog.id}`}
        className="block bg-white rounded-lg transition-shadow duration-300 overflow-hidden cursor-pointer hover:shadow-lg"
      >
       
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center text-sm justify-between font-semibold">
            <h1 className="text-[#6841c7]">{blog.author}</h1>
            <h1 className="text-[#6841c7]">{blog.date}</h1>
          </div>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-lg font-bold text-gray-800 truncate transform transition-transform duration-300">
              {blog.title}
            </h3>
            <ArrowUpRight className="transform group-hover:scale-150 transition-transform duration-300" />
          </div>
          <p className="text-sm text-gray-600 mt-2 truncate">{blog.content}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#f8f4ff] rounded-xl text-xs font-semibold text-blue-600 py-1 px-2 inline-block"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default BlogTile;
