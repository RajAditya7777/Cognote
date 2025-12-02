'use client';

import { motion } from 'framer-motion';

export function FadeIn({ children, className = '', delay = 0, duration = 0.5, yOffset = 20 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
