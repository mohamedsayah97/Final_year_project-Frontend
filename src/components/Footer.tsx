// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1 - Title and description */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              OptiManage
            </h3>
            <p className="text-gray-600 text-sm">
              Optimized management solution for your professional projects.
            </p>
          </div>

          {/* Column 2 - Quick links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-600 hover:text-blue-600 text-sm">
                  About Us
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-blue-600 text-sm">
                  Services
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-blue-600 text-sm">
                  Contact
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-blue-600 text-sm">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Contact
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 text-sm">contact@optimanage.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600 text-sm">+1 234 567 890</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600 text-sm">New York, USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 OptiManage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;