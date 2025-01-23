import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Heading from './Heading';

const blogs = [
  {
    id: '1',
    title: 'Exploring the Beauty of Nature',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUpEeP5nEdV-28s7wOmm0zHn67_V0GqKomRg&s',
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi nesciunt suscipit voluptate consequatur quibusdam impedit praesentium aperiam! Nam, minus perferendis. Tempora excepturi perspiciatis inventore sunt numquam, minima laboriosam iusto voluptate dignissimos quod aperiam quia voluptatum ea labore quisquam? Quisquam similique commodi, eius iure tempore dolorem iusto nostrum voluptas laborum ullam ratione autem incidunt tenetur expedita adipisci nesciunt animi eos nam voluptatem rem, saepe, ea cupiditate. Ipsa deleniti dolorem praesentium consectetur aut placeat eligendi? Nostrum maxime sequi ad obcaecati maiores commodi fugiat ducimus, aspernatur iusto itaque eum praesentium recusandae sed reiciendis distinctio facilis natus deserunt corporis! Quisquam esse vitae aspernatur, accusantium veritatis omnis exercitationem sed! Excepturi molestiae id, necessitatibus asperiores dolor voluptatem animi, placeat perspiciatis ex inventore omnis autem alias delectus possimus dolorem tempore saepe ipsum dolorum non. Vel nulla similique corrupti. Culpa obcaecati dicta neque facilis non eveniet! Iure, perferendis! Officiis blanditiis quisquam labore perferendis culpa, ea eos? Laborum, atque?",
    tags: ['Nature', 'Travel', 'Outdoors'],
    author: 'Alec Whitten',
    date: '23 Jan 2025',
  },
  {
    id: '2',
    title: 'The Future of Technology',
    image: 'https://media.licdn.com/dms/image/D4E12AQFIPRZrRWfQAw/article-cover_image-shrink_720_1280/0/1698585517809?e=2147483647&v=beta&t=ROGyP8JonQLIPT5h_g9zhPFvvHTFkwtylXI8efg3r6Q',
    content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto, sapiente at expedita quaerat fugiat eius doloribus ut hic libero quam vero quis debitis vel voluptatum magni commodi autem corrupti cum distinctio obcaecati omnis quae aut? Modi illum fuga excepturi nesciunt animi quam laudantium labore doloribus sed libero? Vitae asperiores est itaque aliquid. Porro laboriosam veniam dicta recusandae fugit explicabo exercitationem, quos voluptate atque temporibus. Dicta adipisci ut labore ratione dolorum laborum blanditiis corrupti aliquam sequi, aspernatur aliquid et? Vero inventore et modi, recusandae officiis doloribus voluptatibus autem repellendus placeat laudantium quisquam hic perferendis tempore libero, quam assumenda, tenetur distinctio laboriosam ratione consectetur perspiciatis! Error vitae voluptates est officiis quas magnam voluptatum accusantium eius id blanditiis a non, repudiandae earum, fugit vel vero mollitia veritatis similique quos harum ad rerum expedita. Sit, ducimus cum velit est eius sequi voluptas voluptatum odit harum quaerat aliquam. Reiciendis sed sapiente officia voluptate alias repellat eum nostrum, tenetur amet ipsam quia, cumque quos officiis omnis aut, eos fugiat delectus est natus voluptates suscipit consectetur molestias. Nulla, provident. Voluptas quas recusandae cumque, nobis voluptatem quisquam quod libero praesentium, numquam earum necessitatibus, ipsam nulla accusamus iusto ipsum consectetur! Ducimus, beatae. Deleniti, magnam? Dolorem, aliquam, magnam tempora architecto neque sit numquam cumque provident autem laborum quos aut suscipit officia ullam laboriosam blanditiis quod nobis est? Repellat et dolor doloremque id alias impedit incidunt quo animi veritatis repudiandae, vitae sequi ut, porro illo nisi ea libero voluptate sunt, pariatur quas suscipit ad? Fugit cupiditate repellat modi, laudantium est illum ullam consectetur earum enim neque ratione veniam doloremque sit distinctio dignissimos ea? Aut doloribus ad assumenda voluptas consequatur. Minus, quod nostrum libero eligendi aspernatur ea, quibusdam, odio optio dolores aliquid aliquam atque accusantium! Possimus, ipsum, at odio voluptate nihil laboriosam, facere quibusdam porro magni quia atque esse voluptates ipsam officiis eius soluta id quas nulla suscipit libero totam tempore reiciendis! Consequuntur, enim ducimus. Commodi fugiat quibusdam maiores minima perferendis recusandae, amet aut repellendus laborum nobis! Voluptatum corrupti nisi rerum, maiores exercitationem dignissimos sapiente eveniet nostrum ratione quibusdam omnis iure. Blanditiis facilis, iure quibusdam non dignissimos, corrupti debitis tempora suscipit, reiciendis optio molestias! Aspernatur, dolore provident quod commodi, autem recusandae voluptatem nam repudiandae, repellat earum minima rerum. A eius veritatis vero, debitis magni odio quas modi ea non, tenetur aliquid in tempora sit animi rem quibusdam nobis cum assumenda eaque, temporibus aspernatur eos quod voluptate! Accusamus omnis est perferendis tempore natus beatae doloribus soluta? Dolor incidunt repellat optio qui. Neque quam explicabo quibusdam ipsam, rem a minima distinctio iste at quasi, debitis, est hic ipsum praesentium expedita molestias! Totam numquam neque reiciendis, laudantium possimus magni sit, quibusdam, et reprehenderit beatae libero excepturi unde? Saepe ab, at placeat illo itaque delectus sint quam magnam ratione earum nisi architecto consequatur quia autem consectetur culpa et accusantium in ut, velit nemo perferendis, beatae cum? Perferendis adipisci exercitationem atque tempora, et consequatur quibusdam nihil officia aperiam quisquam, est reiciendis sunt laudantium earum itaque quas iure magni ut sed. Laboriosam nam quia eos voluptate atque. Magni.',
    tags: ['Technology', 'AI', 'Innovation'],
    author: 'Sophia Brown',
    date: '15 Jan 2025',
  },
  {
    id: '3',
    title: ' Journey Around the World',
    image: 'https://media.wired.com/photos/629a5c0d3131584d31836046/master/pass/Laptop-Second-Display-Gear-GettyImages-1367337688.jpg',
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime eaque impedit rem saepe minus est odio ab optio cum veritatis repellat voluptatum omnis id, expedita fugit similique excepturi nobis architecto sequi adipisci nihil magni? Fuga, iste minus velit quod ea placeat aliquam at tenetur mollitia, distinctio magni quae nulla deserunt, commodi quam culpa asperiores illum dolorem reprehenderit quidem. Maiores, corrupti? Nam corporis officiis quasi ab culpa error incidunt! Rerum blanditiis rem eos doloremque error, nesciunt ex repudiandae possimus totam dolore aperiam aliquid minima mollitia, assumenda fugiat tempore voluptates accusantium natus sequi perspiciatis suscipit optio ipsa, ducimus adipisci. Dolorum dolor quod quia veniam dolore magnam suscipit qui totam! Magni maiores culpa quas hic soluta quisquam perspiciatis, ipsam earum, exercitationem, dolore nulla assumenda? Amet, totam quis quidem, quasi, perspiciatis fugiat architecto placeat eaque suscipit in odit eius. Officiis, nim, labore unde totam a fugiat debitis aperiam, tenetur exercitationem beatae ad laboriosam ex architecto. Eaque delectus at ad similique enim molestias minus optio aliquid. Commodi nobis illum quam asperiores adipisci? Facilis fuga error quam adipisci illo accusantium ipsam sit itaque, ut debitis soluta reprehenderit aspernatur! Accusamus voluptatibus consequatur, et possimus laudantium cum inventore totam fugiat! Aspernatur, eum ipsam quam consectetur sunt non, nesciunt, tempore excepturi expedita eveniet dolorem nulla libero temporibus. Eaque distinctio, aliquam, nam nulla suscipit laborum eum maiores nihil perspiciatis ipsa, voluptate beatae non soluta laudantium consequuntur sint eligendi quas sit quod ratione reiciendis. Nihil non sed doloremque dolores suscipit ullam exercitationem, nobis quos sunt. Rerum qui quasi soluta veniam pariatur.',
    tags: ['Food', 'Culture', 'Travel'],
    author: 'Liam Johnson',
    date: '10 Jan 2025',
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

const BlogDetail = () => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-800">Blog not found!</h1>
      </div>
    );
  }

  const suggestions = blogs.filter((b) => b.id !== id);

  return (
    <div className="min-h-screen">
      <Heading />
      <div className="flex items-center justify-center pt-10 pb-20">
        <div className="grid grid-cols-12 gap-6 w-[90%]">
          {/* Blog Content */}
          <div className="col-span-8 rounded-lg shadow-lg overflow-hidden ">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-72 object-cover"
            />
            <div className="p-8">
             <div className='flex items-center justify-between'>
             <h1 className="text-2xl font-extrabold text-gray-800 mb-4">{blog.title}</h1>
             <div className='flex gap-6 text-gray-600'>
             <h1 className="text-sm font-bold mb-4">{blog.author}</h1>
             <h1 className="text-sm font-bold mb-4">{blog.date}</h1>
             </div>
             </div>
              <p className="text-gray-600 leading-relaxed mb-8">{blog.content}</p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-600 text-xs font-semibold rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to="/blogs"
                className="block mt-8 text-center text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 px-6 rounded-full shadow-lg transition-all"
              >
                Back to Blogs
              </Link>
            </div>
          </div>

          {/* Suggestions - Sticky on scroll */}
          <div className="w-[25vw] rounded-lg shadow-lg p-4 bg-white fixed right-[10vh] top-30 h-[80vh] overflow-y-auto hide-scrollbar">
            <h2 className="text-md font-bold text-gray-800 mb-4">Recommended</h2>
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <Link
                  to={`/blog/${suggestion.id}`}
                  key={suggestion.id}
                  className="block bg-gray-50 hover:bg-gray-100 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
                >
                  <div className="flex items-start gap-4 p-4 h-[14vh]">
                    {/* Image taking full height */}
                    <img
                      src={suggestion.image}
                      alt={suggestion.title}
                      className="w-1/3 h-13 object-cover rounded-lg"
                    />

                    {/* Text Content */}
                    <div className="flex flex-col justify-between w-2/3">
                      <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
                        <span className="text-[#336fb3]">{suggestion.author}</span>
                        <span>{suggestion.date}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                        {suggestion.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
