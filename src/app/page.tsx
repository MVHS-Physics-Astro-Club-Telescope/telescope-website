import Hero from "@/components/Hero";
import TelescopeShowcase from "@/components/TelescopeShowcase";
import ObservatoryStrip from "@/components/ObservatoryStrip";
import CrewStrip from "@/components/CrewStrip";
import LogStrip from "@/components/LogStrip";
import SupportCompact from "@/components/SupportCompact";

export default function Home() {
  return (
    <>
      <Hero />
      <TelescopeShowcase />
      <ObservatoryStrip />
      <CrewStrip />
      <LogStrip />
      <SupportCompact />
    </>
  );
}
