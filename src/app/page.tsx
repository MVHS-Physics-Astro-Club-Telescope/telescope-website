import Hero from "@/components/Hero";
import About from "@/components/About";
import Team from "@/components/Team";
import Specs from "@/components/Specs";
import Timeline from "@/components/Timeline";
import FundraisingProgress from "@/components/FundraisingProgress";
import Sponsorship from "@/components/Sponsorship";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Team />
      <Specs />
      <Timeline />
      <FundraisingProgress />
      <Sponsorship />
    </>
  );
}
