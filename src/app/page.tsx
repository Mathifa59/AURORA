import { ChatWidget } from "@/components/chat/chat-widget";
import { RestaurantCTA } from "@/components/landing/restaurant-cta";
import { RestaurantFooter } from "@/components/landing/restaurant-footer";
import { RestaurantHero } from "@/components/landing/restaurant-hero";
import { RestaurantInfo } from "@/components/landing/restaurant-info";
import { RestaurantMenu } from "@/components/landing/restaurant-menu";
import { RestaurantNav } from "@/components/landing/restaurant-nav";

export default function HomePage() {
  return (
    <div className="bg-white">
      <RestaurantNav />
      <main>
        <RestaurantHero />
        <RestaurantMenu />
        <RestaurantInfo />
        <RestaurantCTA />
      </main>
      <RestaurantFooter />
      <ChatWidget />
    </div>
  );
}
