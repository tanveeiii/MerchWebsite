import { NavbarFinal } from "../../components/Navbar";
// import {Navbar} from "../../components/ui/resizable-navbar";
import Footer from "../../components/Footer";
import TopPicks from "./components/TopPicks";
import MostGifted from "./components/MostGifted";
import CustomTees from "./components/CustomTees";
import BestSellers from "./components/BestSellers";
import Inspiration from "./components/Inspiration";
import SearchBox from "../../components/SearchBox";
import Hero from "./components/Hero"
// import TopPicks from "./components/TopPicks";

const Discover = () => {
  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <Hero />
      <div className="flex max-h-1/4 ml-3">
      <TopPicks />
      <MostGifted />
      </div>
      <BestSellers />
      <Footer />
    </div>
  );
};

export default Discover;
