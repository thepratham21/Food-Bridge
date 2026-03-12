import React, { useState } from "react";
import {
  FaHandHoldingHeart,
  FaHandHoldingUsd,
  FaUsers,
  FaGift,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate(); // ✅ THIS IS CORRECT PLACE

  const newsCategories = [
    { id: "all", name: "All News" },
    { id: "politics", name: "Politics" },
    { id: "social", name: "Social Impact" },
    { id: "environment", name: "Environment" },
    { id: "health", name: "Health" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-800/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center"></div>

        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Share Food, Spread Joy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-emerald-100 max-w-3xl mb-8"
          >
            Join our community to reduce food waste and help those in need
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => navigate("/donate")}
              className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Donate Now
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/10 transition">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                1.2M+
              </div>
              <p className="text-gray-700">Meals Shared</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                25K+
              </div>
              <p className="text-gray-700">Active Volunteers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                120+
              </div>
              <p className="text-gray-700">Cities Covered</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                85%
              </div>
              <p className="text-gray-700">Food Waste Reduced</p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Ways to Contribute
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose how you'd like to make a difference in your community.
              Every contribution matters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaHandHoldingHeart className="text-4xl text-red-500" />,
                title: "Food Donation",
                desc: "Share surplus food with those in need",
                color: "bg-red-50",
              },
              {
                icon: <FaHandHoldingUsd className="text-4xl text-green-500" />,
                title: "Money Donation",
                desc: "Support our operations with financial contributions",
                color: "bg-green-50",
              },
              {
                icon: <FaUsers className="text-4xl text-blue-500" />,
                title: "Volunteer",
                desc: "Give your time to help distribute food",
                color: "bg-blue-50",
              },
              {
                icon: <FaGift className="text-4xl text-yellow-500" />,
                title: "Gift Donation",
                desc: "Contribute essential items for those in need",
                color: "bg-yellow-50",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className={`${item.color} rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all cursor-pointer`}
              >
                <div className="flex justify-center mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6">{item.desc}</p>
                <button className="bg-emerald-500 text-white px-6 py-2 rounded-full font-medium hover:bg-emerald-600 transition">
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Latest News & Updates
              </h2>
              <p className="text-gray-600">
                Stay informed about food security and community initiatives
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {newsCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === category.id
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Main News Item */}
            <div className="md:col-span-5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <div
                  className="h-64 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1615361200141-f45040f0be0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1672&q=80')",
                  }}
                ></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">
                      Food Security
                    </span>
                    <span className="text-gray-500 text-sm ml-4">
                      Oct 12, 2023
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Global Initiative Aims to Reduce Food Waste by 50% by 2030
                  </h3>
                  <p className="text-gray-600 mb-4">
                    A new coalition of governments, businesses, and NGOs has
                    launched an ambitious plan to tackle food waste worldwide.
                  </p>
                  <a
                    href="#"
                    className="text-emerald-600 font-medium hover:underline flex items-center"
                  >
                    Read Full Story
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Smaller News Items */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  image:
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
                  category: "Community",
                  title:
                    "Local Volunteers Distribute 5,000 Meals During Holiday Season",
                  date: "Dec 24, 2023",
                },
                {
                  image:
                    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
                  category: "Nutrition",
                  title:
                    "New Study Shows Impact of Food Donations on Child Development",
                  date: "Nov 15, 2023",
                },
                {
                  image:
                    "https://images.unsplash.com/photo-1517244683847-7456b63c5969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
                  category: "Technology",
                  title:
                    "App Connects Restaurants with Food Banks to Reduce Waste",
                  date: "Oct 30, 2023",
                },
              ].map((news, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md"
                >
                  <div
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url('${news.image}')` }}
                  ></div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {news.category}
                      </span>
                      <span className="text-gray-500 text-xs ml-2">
                        {news.date}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">
                      {news.title}
                    </h4>
                    <a
                      href="#"
                      className="text-emerald-600 text-sm font-medium hover:underline"
                    >
                      Read More
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-white text-emerald-600 border-2 border-emerald-600 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition">
              View All News
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What People Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stories from our community of donors, volunteers, and
              beneficiaries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Donating through FoodShare has been incredibly rewarding. Knowing my surplus food helps families in need gives me peace of mind.",
                name: "Sarah Johnson",
                role: "Restaurant Owner",
              },
              {
                quote:
                  "As a volunteer, I've seen firsthand how this platform brings communities together. Every weekend I help distribute food to those who need it most.",
                name: "Michael Chen",
                role: "Volunteer",
              },
              {
                quote:
                  "During a difficult time, FoodShare provided meals for my family. This initiative is a lifeline for so many in our community.",
                name: "Maria Rodriguez",
                role: "Beneficiary",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-md"
              >
                <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-600 italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12"></div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-emerald-100 max-w-2xl mx-auto mb-10">
            Join thousands of others who are reducing food waste and helping
            their communities. Every contribution counts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/donate")}
              className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg"
            >
              Donate Now
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition">
              Become a Volunteer
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-white p-2 rounded-full mr-3">
                  <FaHandHoldingHeart className="text-emerald-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold">FoodShare</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting surplus food with those in need to build stronger
                communities and reduce waste.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Our Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Donation Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Food Safety
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Annual Report
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-400">contact@foodshare.org</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-gray-400">+1 (800) 123-4567</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-400">
                    123 Community St, City, Country
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} FoodShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
