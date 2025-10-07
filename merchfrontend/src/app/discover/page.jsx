import { NavbarFinal } from "../../components/Navbar";
// import {Navbar} from "../../components/ui/resizable-navbar";
import Footer from "../../components/Footer";
import TopPicks from "./components/TopPicks";
import TrendSetter from "./components/TrendSetter";
import CustomTees from "./components/CustomTees";
import BestSellers from "./components/BestSellers";
import Inspiration from "./components/Inspiration";
import SearchBox from "../../components/SearchBox";
import Hero from "./components/Hero"

const Discover = () => {
  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <Hero />
      <Footer />
    </div>
  );
};

export default Discover;
