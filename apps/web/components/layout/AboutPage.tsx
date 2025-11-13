"use client";

import { motion } from "framer-motion";
import {
  Users,
  Target,
  Heart,
  Zap,
  BookOpen,
  Globe,
  Award,
  TrendingUp,
} from "lucide-react";
import styles from "../../app/page.module.css";

export default function AboutPage() {
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "10K+",
      label: "Active Users",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      value: "50K+",
      label: "Posts Published",
    },
    { icon: <Globe className="w-6 h-6" />, value: "100+", label: "Countries" },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: "1M+",
      label: "Monthly Reads",
    },
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      description:
        "To empower writers and readers worldwide by providing a platform that celebrates creativity, knowledge sharing, and meaningful connections.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community First",
      description:
        "We believe in building a supportive community where every voice matters and every story deserves to be heard.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Innovation",
      description:
        "Continuously improving our platform with cutting-edge technology to deliver the best writing and reading experience.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Content",
      description:
        "We're committed to maintaining high standards of content quality while respecting diverse perspectives and voices.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      avatar: "SJ",
      bio: "Passionate about democratizing content creation",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      avatar: "MC",
      bio: "Building technology that empowers writers",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Community",
      avatar: "ER",
      bio: "Creating meaningful connections between writers",
    },
    {
      name: "David Kim",
      role: "Lead Designer",
      avatar: "DK",
      bio: "Crafting beautiful and intuitive experiences",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className={`text-4xl md:text-6xl font-bold mb-6 ${styles.textGradient}`}
            >
              About Blogify
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to create the world's best platform for writers
              and readers. A place where ideas flourish, stories inspire, and
              communities thrive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              <p>
                Blogify was born from a simple idea: everyone has a story worth
                sharing. In 2020, our founders noticed that while there were
                many blogging platforms, few truly focused on building a
                supportive community of writers and readers.
              </p>
              <p>
                We started with a small group of passionate writers who wanted
                more than just a place to publish—they wanted a home for their
                ideas, a community that valued their voice, and tools that made
                writing a joy rather than a chore.
              </p>
              <p>
                Today, Blogify has grown into a thriving platform where
                thousands of writers share their knowledge, experiences, and
                creativity with readers around the world. But our mission
                remains the same: to make great writing accessible to everyone.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            What We Stand For
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl border shadow border-gray-200 dark:border-gray-700 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-900 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 17,
                }}
                viewport={{ once: true }}
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're a diverse team of writers, designers, and developers
              passionate about building the future of online publishing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 17,
                }}
                viewport={{ once: true }}
              >
                <div className="relative mb-4 mx-auto w-32 h-32">
                  <div className="w-full h-full rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {member.avatar}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          className={`max-w-4xl mx-auto text-center rounded-2xl p-12 text-white ${styles.animationGradient}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-6 opacity-90">
            Be part of a growing community of writers and readers who are
            passionate about sharing knowledge and stories.
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started Today
          </a>
        </motion.div>
      </section>
    </div>
  );
}
