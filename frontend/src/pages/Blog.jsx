import React from 'react'
import BlogTile from '../components/BlogTile';
import Heading from '../components/Heading';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const blogs = [
    {
      id: '1',
      title: 'Exploring the Beauty of Nature',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUpEeP5nEdV-28s7wOmm0zHn67_V0GqKomRg&s',
      content: 'Nature is the art of God. Experience the lush greenery, serene landscapes, and the tranquility of the great outdoors.',
      tags: ['Nature', 'Travel', 'Outdoors'],
      author: 'Alec Whitten',
      date: '23 Jan 2025',
    },
    {
      id: '2',
      title: 'The Future of Technology',
      image: 'https://media.licdn.com/dms/image/D4E12AQFIPRZrRWfQAw/article-cover_image-shrink_720_1280/0/1698585517809?e=2147483647&v=beta&t=ROGyP8JonQLIPT5h_g9zhPFvvHTFkwtylXI8efg3r6Q',
      content: 'Dive into the advancements in AI, robotics, and futuristic tech that are reshaping the world.',
      tags: ['Technology', 'AI', 'Innovation'],
      author: 'Sophia Brown',
      date: '15 Jan 2025',
    },
    {
      id: '3',
      title: ' Journey Around the World',
      image: 'https://media.wired.com/photos/629a5c0d3131584d31836046/master/pass/Laptop-Second-Display-Gear-GettyImages-1367337688.jpg',
      content: 'Explore the flavors of the world with our guide to international cuisines and iconic dishes.',
      tags: ['Food', 'Culture', 'Travel'],
      author: 'Liam Johnson',
      date: '10 Jan 2025',
    },
    {
        id: '1',
        title: 'Exploring the Beauty of Nature',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUpEeP5nEdV-28s7wOmm0zHn67_V0GqKomRg&s',
        content: 'Nature is the art of God. Experience the lush greenery, serene landscapes, and the tranquility of the great outdoors.',
        tags: ['Nature', 'Travel', 'Outdoors'],
        author: 'Alec Whitten',
        date: '23 Jan 2025',
      },
      {
        id: '2',
        title: 'The Future of Technology',
        image: 'https://media.licdn.com/dms/image/D4E12AQFIPRZrRWfQAw/article-cover_image-shrink_720_1280/0/1698585517809?e=2147483647&v=beta&t=ROGyP8JonQLIPT5h_g9zhPFvvHTFkwtylXI8efg3r6Q',
        content: 'Dive into the advancements in AI, robotics, and futuristic tech that are reshaping the world.',
        tags: ['Technology', 'AI', 'Innovation'],
        author: 'Sophia Brown',
        date: '15 Jan 2025',
      },
      {
        id: '3',
        title: ' Journey Around the World',
        image: 'https://media.wired.com/photos/629a5c0d3131584d31836046/master/pass/Laptop-Second-Display-Gear-GettyImages-1367337688.jpg',
        content: 'Explore the flavors of the world with our guide to international cuisines and iconic dishes.',
        tags: ['Food', 'Culture', 'Travel'],
        author: 'Liam Johnson',
        date: '10 Jan 2025',
      },
      {
        id: '1',
        title: 'Exploring the Beauty of Nature',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUpEeP5nEdV-28s7wOmm0zHn67_V0GqKomRg&s',
        content: 'Nature is the art of God. Experience the lush greenery, serene landscapes, and the tranquility of the great outdoors.',
        tags: ['Nature', 'Travel', 'Outdoors'],
        author: 'Alec Whitten',
        date: '23 Jan 2025',
      },
      {
        id: '2',
        title: 'The Future of Technology',
        image: 'https://media.licdn.com/dms/image/D4E12AQFIPRZrRWfQAw/article-cover_image-shrink_720_1280/0/1698585517809?e=2147483647&v=beta&t=ROGyP8JonQLIPT5h_g9zhPFvvHTFkwtylXI8efg3r6Q',
        content: 'Dive into the advancements in AI, robotics, and futuristic tech that are reshaping the world.',
        tags: ['Technology', 'AI', 'Innovation'],
        author: 'Sophia Brown',
        date: '15 Jan 2025',
      },
      {
        id: '3',
        title: ' Journey Around the World',
        image: 'https://media.wired.com/photos/629a5c0d3131584d31836046/master/pass/Laptop-Second-Display-Gear-GettyImages-1367337688.jpg',
        content: 'Explore the flavors of the world with our guide to international cuisines and iconic dishes.',
        tags: ['Food', 'Culture', 'Travel'],
        author: 'Liam Johnson',
        date: '10 Jan 2025',
      },
      {
        id: '1',
        title: 'Exploring the Beauty of Nature',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUpEeP5nEdV-28s7wOmm0zHn67_V0GqKomRg&s',
        content: 'Nature is the art of God. Experience the lush greenery, serene landscapes, and the tranquility of the great outdoors.',
        tags: ['Nature', 'Travel', 'Outdoors'],
        author: 'Alec Whitten',
        date: '23 Jan 2025',
      },
      {
        id: '2',
        title: 'The Future of Technology',
        image: 'https://media.licdn.com/dms/image/D4E12AQFIPRZrRWfQAw/article-cover_image-shrink_720_1280/0/1698585517809?e=2147483647&v=beta&t=ROGyP8JonQLIPT5h_g9zhPFvvHTFkwtylXI8efg3r6Q',
        content: 'Dive into the advancements in AI, robotics, and futuristic tech that are reshaping the world.',
        tags: ['Technology', 'AI', 'Innovation'],
        author: 'Sophia Brown',
        date: '15 Jan 2025',
      },
      {
        id: '3',
        title: ' Journey Around the World',
        image: 'https://media.wired.com/photos/629a5c0d3131584d31836046/master/pass/Laptop-Second-Display-Gear-GettyImages-1367337688.jpg',
        content: 'Explore the flavors of the world with our guide to international cuisines and iconic dishes.',
        tags: ['Food', 'Culture', 'Travel'],
        author: 'Liam Johnson',
        date: '10 Jan 2025',
      },
      {
        id: '1',
        title: 'Exploring the Beauty of Nature',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUpEeP5nEdV-28s7wOmm0zHn67_V0GqKomRg&s',
        content: 'Nature is the art of God. Experience the lush greenery, serene landscapes, and the tranquility of the great outdoors.',
        tags: ['Nature', 'Travel', 'Outdoors'],
        author: 'Alec Whitten',
        date: '23 Jan 2025',
      },
      {
        id: '2',
        title: 'The Future of Technology',
        image: 'https://media.licdn.com/dms/image/D4E12AQFIPRZrRWfQAw/article-cover_image-shrink_720_1280/0/1698585517809?e=2147483647&v=beta&t=ROGyP8JonQLIPT5h_g9zhPFvvHTFkwtylXI8efg3r6Q',
        content: 'Dive into the advancements in AI, robotics, and futuristic tech that are reshaping the world.',
        tags: ['Technology', 'AI', 'Innovation'],
        author: 'Sophia Brown',
        date: '15 Jan 2025',
      },
      {
        id: '3',
        title: ' Journey Around the World',
        image: 'https://media.wired.com/photos/629a5c0d3131584d31836046/master/pass/Laptop-Second-Display-Gear-GettyImages-1367337688.jpg',
        content: 'Explore the flavors of the world with our guide to international cuisines and iconic dishes.',
        tags: ['Food', 'Culture', 'Travel'],
        author: 'Liam Johnson',
        date: '10 Jan 2025',
      },
      {
        id: '1',
        title: 'Exploring the Beauty of Nature',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUpEeP5nEdV-28s7wOmm0zHn67_V0GqKomRg&s',
        content: 'Nature is the art of God. Experience the lush greenery, serene landscapes, and the tranquility of the great outdoors.',
        tags: ['Nature', 'Travel', 'Outdoors'],
        author: 'Alec Whitten',
        date: '23 Jan 2025',
      },
      {
        id: '2',
        title: 'The Future of Technology',
        image: 'https://media.licdn.com/dms/image/D4E12AQFIPRZrRWfQAw/article-cover_image-shrink_720_1280/0/1698585517809?e=2147483647&v=beta&t=ROGyP8JonQLIPT5h_g9zhPFvvHTFkwtylXI8efg3r6Q',
        content: 'Dive into the advancements in AI, robotics, and futuristic tech that are reshaping the world.',
        tags: ['Technology', 'AI', 'Innovation'],
        author: 'Sophia Brown',
        date: '15 Jan 2025',
      },
      {
        id: '3',
        title: ' Journey Around the World',
        image: 'https://media.wired.com/photos/629a5c0d3131584d31836046/master/pass/Laptop-Second-Display-Gear-GettyImages-1367337688.jpg',
        content: 'Explore the flavors of the world with our guide to international cuisines and iconic dishes.',
        tags: ['Food', 'Culture', 'Travel'],
        author: 'Liam Johnson',
        date: '10 Jan 2025',
      },
      {
        id: '1',
        title: 'Exploring the Beauty of Nature',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUpEeP5nEdV-28s7wOmm0zHn67_V0GqKomRg&s',
        content: 'Nature is the art of God. Experience the lush greenery, serene landscapes, and the tranquility of the great outdoors.',
        tags: ['Nature', 'Travel', 'Outdoors'],
        author: 'Alec Whitten',
        date: '23 Jan 2025',
      },
      {
        id: '2',
        title: 'The Future of Technology',
        image: 'https://media.licdn.com/dms/image/D4E12AQFIPRZrRWfQAw/article-cover_image-shrink_720_1280/0/1698585517809?e=2147483647&v=beta&t=ROGyP8JonQLIPT5h_g9zhPFvvHTFkwtylXI8efg3r6Q',
        content: 'Dive into the advancements in AI, robotics, and futuristic tech that are reshaping the world.',
        tags: ['Technology', 'AI', 'Innovation'],
        author: 'Sophia Brown',
        date: '15 Jan 2025',
      },
      {
        id: '3',
        title: ' Journey Around the World',
        image: 'https://media.wired.com/photos/629a5c0d3131584d31836046/master/pass/Laptop-Second-Display-Gear-GettyImages-1367337688.jpg',
        content: 'Explore the flavors of the world with our guide to international cuisines and iconic dishes.',
        tags: ['Food', 'Culture', 'Travel'],
        author: 'Liam Johnson',
        date: '10 Jan 2025',
      },
      {
        id: '1',
        title: 'Exploring the Beauty of Nature',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUpEeP5nEdV-28s7wOmm0zHn67_V0GqKomRg&s',
        content: 'Nature is the art of God. Experience the lush greenery, serene landscapes, and the tranquility of the great outdoors.',
        tags: ['Nature', 'Travel', 'Outdoors'],
        author: 'Alec Whitten',
        date: '23 Jan 2025',
      },
      {
        id: '2',
        title: 'The Future of Technology',
        image: 'https://media.licdn.com/dms/image/D4E12AQFIPRZrRWfQAw/article-cover_image-shrink_720_1280/0/1698585517809?e=2147483647&v=beta&t=ROGyP8JonQLIPT5h_g9zhPFvvHTFkwtylXI8efg3r6Q',
        content: 'Dive into the advancements in AI, robotics, and futuristic tech that are reshaping the world.',
        tags: ['Technology', 'AI', 'Innovation'],
        author: 'Sophia Brown',
        date: '15 Jan 2025',
      },
      {
        id: '3',
        title: ' Journey Around the World',
        image: 'https://media.wired.com/photos/629a5c0d3131584d31836046/master/pass/Laptop-Second-Display-Gear-GettyImages-1367337688.jpg',
        content: 'Explore the flavors of the world with our guide to international cuisines and iconic dishes.',
        tags: ['Food', 'Culture', 'Travel'],
        author: 'Liam Johnson',
        date: '10 Jan 2025',
      },
   
  ];
  
const Blog = () => {
  return (
    <div>
      <div className="min-h-screen">
        <Heading/>
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 py-2">
        {blogs.map((blog) => (
          <BlogTile key={blog.id} blog={blog} />
        ))}
      </div>
      <Footer/>
    </div>
    
    </div>
  )
}

export default Blog
