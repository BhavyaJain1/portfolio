import AnimatedBackground from "@/components/AnimatedBackground";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SplashGate } from "@/components/Splash";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { More } from "@/components/sections/More";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

export default function Home() {
  return (
    <SplashGate>
      <AnimatedBackground />
      <ScrollProgress />
      <Nav />

      <main>
        <Hero />
        <Experience />
        <Achievements />
        <Projects />
        <Skills />
        <Education />
        <More />
        <Contact />
      </main>
    </SplashGate>
  );
}
