"use client";
import React from "react";
import { motion } from "motion/react";


export const Testimonials = () => {
  const testimonials = [
    {
      text: "NotebookLM is the most useful AI tool I've used. It completely transforms how I organize my research.",
      name: "HardFork",
      role: "Tech Podcast",
      image: "https://ui.shadcn.com/avatars/01.png",
    },
    {
      text: "It's like having a research assistant that never sleeps. The insights are instant and accurate.",
      name: "CNBC",
      role: "Business News",
      image: "https://ui.shadcn.com/avatars/02.png",
    },
    {
      text: "The audio overviews are shockingly good. It turns dry documents into engaging conversations.",
      name: "The Verge",
      role: "Tech News",
      image: "https://ui.shadcn.com/avatars/03.png",
    },
    {
      text: "A game changer for synthesizing information. I use it daily for my deep dives.",
      name: "Andrej Karpathy",
      role: "AI Researcher",
      image: "https://ui.shadcn.com/avatars/04.png",
    },
    {
      text: "The citation feature gives me confidence in the answers. I can always verify the source.",
      name: "Research Daily",
      role: "Academic Journal",
      image: "https://ui.shadcn.com/avatars/05.png",
    },
    {
      text: "Privacy first approach is what convinced me to switch. My data feels safe.",
      name: "TechPrivacy",
      role: "Security Blog",
      image: "https://ui.shadcn.com/avatars/01.png",
    },
  ];

  return (
    <section className="py-24 bg-black text-white border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-16 text-center">
          Loved by researchers, writers, and students
        </h2>
        <div className="relative h-[600px] overflow-hidden flex gap-6 mask-gradient">
          <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={15} className="w-full md:w-1/3" />
          <TestimonialsColumn testimonials={testimonials.slice(2, 5)} duration={20} className="hidden md:block w-1/3" />
          <TestimonialsColumn testimonials={testimonials.slice(0, 4).reverse()} duration={18} className="hidden lg:block w-1/3" />
        </div>
      </div>
    </section>
  );
};

export const TestimonialsColumn = (props) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6">
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 w-full"
                  key={i}>
                  <div className="text-lg text-gray-300 leading-relaxed mb-6">"{text}"</div>
                  <div className="flex items-center gap-4">
                    <img
                      width={48}
                      height={48}
                      src={image}
                      alt={name}
                      className="h-12 w-12 rounded-full object-cover border border-white/10" />
                    <div className="flex flex-col">
                      <div className="font-semibold text-white">{name}</div>
                      <div className="text-sm text-gray-500">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};