import type { Metadata } from "next";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { spaces } from "@/lib/spaces";
import { SpacesDirectory } from "./spaces-directory";

export const metadata: Metadata = {
  title: "Nomad Spaces",
  description:
    "Find the best cafes and coworking spaces in Istanbul for remote work. Each spot is rated with a Nomad Score based on wifi, power, comfort, noise, value, and vibe.",
};

export default function SpacesPage() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Nomad Spaces</SectionTitle>
        <SectionDescription>
          Wifi-tested cafes and coworking spots across Istanbul. Every space
          gets a Nomad Score based on what actually matters for remote work -
          wifi speed, power outlets, comfort, noise level, value, and vibe.
        </SectionDescription>
      </SectionHeader>

      <SpacesDirectory spaces={spaces} />
    </Section>
  );
}
