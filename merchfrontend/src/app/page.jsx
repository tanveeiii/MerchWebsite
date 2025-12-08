import { NavbarFinal } from "../components/Navbar";
import Footer from "../components/Footer";
import TopPicks from "./discover/components/TopPicks";
import MostGifted from "./discover/components/MostGifted";
import CustomTees from "./discover/components/SignupSection";
import BestSellers from "./discover/components/BestSellers";
import Inspiration from "./discover/components/Inspiration";
import Hero from "./discover/components/Hero";

// Note: I updated the import paths above to point to the 'discover' folder
// since we are now in the root 'app' folder.

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <Hero />
      <div className="flex max-h-1/4 ml-3">
        <TopPicks />
        <MostGifted />
      </div>
      <BestSellers scrollLtoR={true} title={"Sports Jersey"} />
      <BestSellers scrollLtoR={false} title={"Events Tshirt"} />
      <CustomTees />
      <Inspiration />
      <Footer />
    </div>
  );
};

export default Home;