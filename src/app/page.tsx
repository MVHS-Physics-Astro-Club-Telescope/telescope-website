import TelescopeStory from "@/components/telescope/TelescopeStory";
import Crew from "@/components/Crew";
import Support from "@/components/Support";
import SchematicsIntro from "@/components/schematics/SchematicsIntro";

export default function Home() {
  return (
    <>
      <TelescopeStory />
      <Crew />
      <Support />
      <SchematicsIntro />
    </>
  );
}
