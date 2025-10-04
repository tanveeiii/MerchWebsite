const Footer = () => {
  return (
    <footer className="bg-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contact Us
            </a>
          </div>

          <div className="text-gray-700">
            &copy; 2023 TeeDesigns. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
