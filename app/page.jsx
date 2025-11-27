import Feautures from "./_components/Feautures";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";
import Navbar from "./_components/Navbar";

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <Hero />
      <Footer />
      <Feautures />
      <HowItWorks />
    </main>
  );
}

