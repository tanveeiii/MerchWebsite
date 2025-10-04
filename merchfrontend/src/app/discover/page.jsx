import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopPicks from "./components/TopPicks";
import TrendSetter from "./components/TrendSetter";
import CustomTees from "./components/CustomTees";
import BestSellers from "./components/BestSellers";
import Inspiration from "./components/Inspiration";
import SearchBox from "./components/SearchBox";

const Discover = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <SearchBox />

      <TopPicks />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <TrendSetter />
          <BestSellers />
        </div>
      </div>

      <CustomTees />
      <Inspiration />

      <Footer />
    </div>
  );
};

export default Discover;
