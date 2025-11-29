// src/components/Header.tsx
'use client';

import React from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { signOut } from 'firebase/auth';
// import { auth } from '@/lib/firebase'; // Make sure this path is correct
import { useRouter } from 'next/navigation';
// The Header component for the Big Game Atlas application.
// It displays a logo, navigation links, and a user profile/login area in a vertical sidebar.
// The design maintains an even skinnier vertical sidebar, tailored to a "Big Game Atlas" feel
// with earthy colors and a robust presence, using Tailwind CSS.
function Header() {
  // const { user, loading } = useAuth(); // Get user and loading state from AuthContext
  const router = useRouter();
  const handleLoginClick = () => {
    router.push('/auth');
  };

  // Handles user logout
  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     console.log('User signed out successfully!');
  //   } catch (error: any) {
  //     console.error('Logout failed:', error.message);
  //   }
  // };

  // Helper to get user's initial for display
  const getUserInitial = (user: { email?: string | null; displayName?: string | null }) => {
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?'; // Fallback if no display name or email
  };

  return (
    // Changed width to 'w-24' to make it skinnier.
    <header className="fixed left-0 top-0 h-full w-24 z-50 bg-gradient-to-b from-green-800 to-green-950 text-white p-4 shadow-lg flex flex-col items-center">
      {/* Container for logo and profile. */}
      <div className="flex flex-col justify-between items-center gap-6 w-full px-0 h-screen">
        {/* Top group */}
        <div className="flex flex-col items-center gap-6">
          <img
            src="big_game_atlas_logo.png" // Placeholder for your logo
            alt="The Big Game Atlas Logo"
            className="mt-4 rounded-md shadow-lg"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/22c55e/ffffff?text=BGA'; }} // Fallback for image
          />
          <div className="flex flex-col items-center gap-2">
            <button className="text-white hover:text-green-200 transition-colors duration-200">Map</button>
            <button className="text-white hover:text-green-200 transition-colors duration-200">Forum</button>
          </div>
        </div>

        {/* User Profile / Login at the bottom */}
        {/* {loading ? (
          // Show a simple loading indicator while auth state is being determined
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white text-lg font-bold">
            ...
          </div>
        ) : user ? (
          // If user is logged in
          <div className="flex flex-col items-center gap-2">
            <button
              className="flex-shrink-0 w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white text-lg font-bold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 ease-in-out"
              aria-label="User profile"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full" />
              ) : (
                getUserInitial(user)
              )}
            </button>
            <button
              onClick={handleLogout}
              className="text-white text-sm hover:text-green-200 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          // If no user is logged in, show the login button
          <button
            onClick={handleLoginClick}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white text-lg font-bold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 ease-in-out"
            aria-label="Login"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </button>
        )} */}
      </div>
    </header>
  );
}

export default Header;
