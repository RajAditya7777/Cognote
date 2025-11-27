"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, Zap, Search } from "lucide-react";

const steps = [
  {
    icon: <Upload className="w-7 h-7" />,
    title: "Upload your sources",
    desc: "Upload PDFs, websites, Google Docs, YouTube links and more. Cognote summarizes them and finds meaningful connections using advanced AI understanding.",
    image: "/t1",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Instant insights",
    desc: "Once your sources are added, Cognote becomes a personalized AI expert. It generates study guides, timelines, FAQs, and clear explanations instantly.",
    image: "/t1",
  },
  {
    icon: <Search className="w-7 h-7" />,
    title: "See the source, not just the answer",
    desc: "Every insight is tied directly to your original sources — giving complete transparency and trust in every answer.",
    image: "/t1",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full py-28 bg-white text-black">
      <div className="max-w-6xl mx-auto px-6 space-y-32">

        {steps.map((step, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            {/* LEFT TEXT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              {/* ICON */}
              <div className="p-2 w-fit rounded-full border border-zinc-300">
                {step.icon}
              </div>

              {/* HEADING */}
              <h3 className="text-3xl font-semibold">{step.title}</h3>

              {/* DESCRIPTION */}
              <p className="text-zinc-600 text-lg leading-relaxed">
                {step.desc}
              </p>
            </motion.div>

            {/* RIGHT GLASS IMAGE CARD */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden bg-black shadow-[0_0_40px_rgba(0,0,0,0.25)] border border-zinc-900"
            >
              <Image
                src={step.image}
                alt={step.title}
                width={900}
                height={600}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        ))}

      </div>
    </section>
  );
}
