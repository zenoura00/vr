import Header from "@/components/Header";
import VRTourSection from "@/components/VRTourSection";
import FloatingIcons from "@/components/FloatingIcons";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <VRTourSection />
      </main>
      <FloatingIcons />
      <Footer />
    </div>
  );
}
