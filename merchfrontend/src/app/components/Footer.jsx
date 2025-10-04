const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-8">
            <a
              href="#"
              className="text-white hover:text-orange-100 transition-colors font-medium"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white hover:text-orange-100 transition-colors font-medium"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-white hover:text-orange-100 transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>

          <div className="text-white font-medium">
            &copy; 2023 TeeDesigns. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
