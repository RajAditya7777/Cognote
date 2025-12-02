import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import SourceUpload from "./_components/SourceUpload";
import Citations from "./_components/Citations";
import AudioOverview from "./_components/AudioOverview";
import Privacy from "./_components/Privacy";
import UseCases from "./_components/UseCases";
import { Testimonials as TestimonialsColumns1 } from "@/components/blocks/testimonials-columns-1";
import { Footer as ModemAnimatedFooter } from "@/components/ui/modem-animated-footer";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <FadeIn><SourceUpload /></FadeIn>
      <FadeIn><Citations /></FadeIn>
      <FadeIn><AudioOverview /></FadeIn>
      <FadeIn><Privacy /></FadeIn>
      <FadeIn><UseCases /></FadeIn>
      <FadeIn><TestimonialsColumns1 /></FadeIn>
      <ModemAnimatedFooter {...footerProps} />
    </main>
  );
}

const footerProps = {
  brandName: "Cognote",
  brandDescription: "Your intelligent notebook. Write, organize, and create with the power of AI.",
  socialLinks: [
    {
      href: "#",
      icon: <Facebook className="w-full h-full" />,
      label: "Facebook",
    },
    {
      href: "#",
      icon: <Instagram className="w-full h-full" />,
      label: "Instagram",
    },
    {
      href: "#",
      icon: <Youtube className="w-full h-full" />,
      label: "Youtube",
    },
    {
      href: "#",
      icon: <Linkedin className="w-full h-full" />,
      label: "LinkedIn",
    },
  ],
  navLinks: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQs", href: "/faqs" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
};

