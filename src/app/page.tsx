'use-client'

import { HomePage } from "@/components/Home";
import { TikTokButton } from "@/components/TikTokButton";

export default function Home() {
  return (
    <div style={{ position: 'relative' }}>
      <HomePage />
      <TikTokButton />
    </div>
  );
}
