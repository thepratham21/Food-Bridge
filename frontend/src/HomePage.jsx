import React, { useState } from "react";
import {
    FaHandHoldingHeart,
    FaUsers,
    FaUserTie,
    FaArrowRight,
    FaLeaf,
    FaChartLine,
    FaGlobeAsia
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const [hoveredRole, setHoveredRole] = useState(null);
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        if (role === "ngo") {
            navigate("/ngo/login");
        }

        if (role === "user") {
            navigate("/user/login");
        }

        if (role === "volunteer") {
            navigate("/volunteer/login");
        }
    };

    const stats = [
        { icon: <FaLeaf />, value: "10K+", label: "Meals Donated" },
        { icon: <FaUsers />, value: "500+", label: "Active Volunteers" },
        { icon: <FaGlobeAsia />, value: "50+", label: "Cities Covered" },
        { icon: <FaChartLine />, value: "85%", label: "Waste Reduced" },
    ];

    const roles = [
        {
            id: "ngo",
            title: "Continue as NGO",
            description: "Manage food donations, coordinate with volunteers, and track impact",
            icon: <FaHandHoldingHeart className="text-4xl" />,
            color: "from-emerald-500 to-teal-500",
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
        {
            id: "user",
            title: "Continue as User",
            description: "Donate surplus food, track your contributions, and help your community",
            icon: <FaUsers className="text-4xl" />,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            id: "volunteer",
            title: "Continue as Volunteer",
            description: "Pick up and deliver food to those in need, earn community points",
            icon: <FaUserTie className="text-4xl" />,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

            {/* Hero Section */}
            <div className="relative h-[80vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-800/90 z-10"></div>

                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1593113598338-cd288d649433?auto=format&fit=crop&w=1770&q=80')",
                    }}
                ></div>

                <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-md p-4 rounded-full mb-6"
                    >
                        <FaHandHoldingHeart className="text-white text-5xl" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-4"
                    >
                        Food<span className="text-emerald-300">Bridge</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-xl md:text-2xl text-emerald-100 max-w-3xl mb-8"
                    >
                        Connecting surplus food with those in need, building stronger communities together
                    </motion.p>

                </div>
            </div>

            {/* Stats Section */}
            <div className="py-12 bg-white shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-emerald-600 text-3xl mb-2 flex justify-center">
                                    {stat.icon}
                                </div>

                                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
                                    {stat.value}
                                </div>

                                <p className="text-gray-600">{stat.label}</p>
                            </motion.div>
                        ))}

                    </div>
                </div>
            </div>

            {/* Role Selection */}
            <div className="py-20 container mx-auto px-4">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ y: -10 }}
                            onHoverStart={() => setHoveredRole(role.id)}
                            onHoverEnd={() => setHoveredRole(null)}
                            onClick={() => handleRoleSelect(role.id)}
                            className="relative cursor-pointer"
                        >

                            <div className={`${role.bgColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col`}>

                                <div className={`mb-6 ${role.iconColor} flex justify-center`}>
                                    {role.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                                    {role.title}
                                </h3>

                                <p className="text-gray-600 mb-6 text-center flex-grow">
                                    {role.description}
                                </p>

                                <motion.button
                                    onClick={() => handleRoleSelect(role.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-full py-4 bg-gradient-to-r ${role.color} text-white font-bold rounded-xl shadow-lg`}
                                >
                                    <span className="flex items-center justify-center">
                                        {role.title}
                                        <FaArrowRight className="ml-2" />
                                    </span>
                                </motion.button>

                            </div>

                        </motion.div>
                    ))}

                </div>
            </div>

        </div>
    );
};

export default HomePage;