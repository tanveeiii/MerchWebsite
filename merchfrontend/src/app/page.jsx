import Link from "next/link";
export default function Landing() {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-16">
        <h1 className="text-2xl font-bold tracking-tight">Tee Customs</h1>
        <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
          Sign up / Sign in
        </button>
      </header>

      <section className="w-full flex flex-col text-center items-center">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Shop Vibrant <span className="text-blue-600">Custom</span> <br /> t-shirt designs
        </h2>
        <p className="text-gray-500 mb-10 text-lg max-w-2xl">Explore thousands of unique t-shirts and personalize your style</p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition">Start shopping</button>
          <button className="px-6 py-3 border border-gray-400 rounded-lg font-medium hover:bg-gray-100 transition">Customize t-shirt</button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center my-20 m">
        <div>
          <p className="text-3xl font-bold text-gray-900">10K+</p>
          <p className="text-gray-600 mt-2">Designs</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">500</p>
          <p className="text-gray-600 mt-2">Catalog</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">100K+</p>
          <p className="text-gray-600 mt-2">Happy Customers</p>
        </div>
      </section>

      <section>
         <h3 className="text-2xl font-bold mb-6">Featured designs this week</h3>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[1, 2, 3, 4,].map((item) => (
            <div key={item} className="p-4 border rounded-lg shadow">
              <img
                src="www.photo.com"
                alt="Design"
                className="rounded-lg mb-4"
              />
              <p className="font-semibold">Custom Tee {item}</p>
              <button className="mt-3 px-4 py-2 bg-black text-white rounded-lg">Add to cart</button>
            </div>
          ))}
        </div>
      </section>

      <section className="my-20 p-10 flex justify-between bg-gray-100 rounded-lg text-center">
        <div>
            <img src="ww.photo.com" alt="Cloths" className="rounded-lg"/>
        </div>
        <div>
            <h3 className="text-4xl font-bold mb-4">Sign up for exclusive deals and updates<br/> on the latest t-shirt designs.</h3>
            <button className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">Sign up</button>
        </div>
      </section>

      <footer className="flex justify-between items-center py-6 border-t text-sm text-gray-600">
         <p>TeeCustom © 2025</p>
         <div className="flex gap-4">
           <Link href="#">Instagram</Link>
           <Link href="#">Twitter</Link>
           <Link href="#">Facebook</Link>
         </div>
       </footer>
    </div>
  );
}
