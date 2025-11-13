import { useState } from 'react';

const InfoButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-white/30 transition-all z-10 border border-white/20"
        aria-label="Information"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">About This App</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold mb-2">Developer</h3>
                <p>Aden</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">About PM Accelerator</h3>
                <p className="mb-2">
                  The Product Manager Accelerator Program is designed to support PM professionals through every stage of their career. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped hundreds of students fulfill their career aspirations.
                </p>
                <p className="mb-2">
                  Our Product Manager Accelerator community is ambitious and committed. Through our program, they have learnt, honed, and developed new PM and leadership skills, giving them a strong foundation for their future endeavours.
                </p>
                <p>
                  Learn more at:{' '}
                  <a
                    href="https://www.linkedin.com/company/productmanagerinterview/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Product Manager Accelerator LinkedIn
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">About This Weather App</h3>
                <p>
                  This weather application was built as part of a technical assessment for the AI Engineer Intern position. It provides real-time weather information and 5-day forecasts using the Weather API.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Search weather by city name, zip code, or coordinates</li>
                  <li>Get weather for your current location using geolocation</li>
                  <li>View current weather conditions with detailed metrics</li>
                  <li>See 5-day weather forecast</li>
                  <li>Real-time data from Weather API</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoButton;
