import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white">
      
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Connect. Build. Grow.
          </h1>

          <p className="mt-6 text-lg text-white/90">
            A transparent and interactive platform to showcase your work,
            connect professionally, and build real trust with people.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-white/90"
            >
              Get Started
            </button>

            <button
              className="border border-white px-6 py-3 rounded-xl hover:bg-white/10"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="Professional collaboration"
            className="rounded-2xl shadow-2xl w-full max-w-md"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white text-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why This Project Is Useful
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Professional Networking",
              "Transparent Profiles",
              "Real Human Connections",
            ].map((title) => (
              <div
                key={title}
                className="bg-white rounded-2xl shadow-lg p-6 text-center"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="icon"
                  className="w-14 h-14 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">
                  Built to feel natural, trustworthy, and genuinely helpful in
                  professional life.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-500">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What People Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white text-gray-800 rounded-2xl p-6"
              >
                <p className="text-sm mb-4">
                  “This platform feels professional yet friendly. It actually
                  makes connecting with people easy.”
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={`https://randomuser.me/api/portraits/men/${i *
                      10}.jpg`}
                    className="w-10 h-10 rounded-full"
                    alt="user"
                  />
                  <div>
                    <p className="font-medium">User Name</p>
                    <p className="text-xs text-gray-500">
                      Software Professional
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gray-900 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Join?
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-8">
          Create an account and start building meaningful professional
          connections today.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="bg-pink-500 hover:bg-pink-600 px-8 py-4 rounded-xl font-semibold"
        >
          Sign Up Now
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
