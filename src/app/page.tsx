// src/app/App.tsx
'use client';

// AuthProvider is imported and used in layout.tsx, so it's not needed here.
// import { AuthProvider } from '@/context/AuthContext';
import { MapContainer } from '@/components/mapContainer';
import { MapControls } from '@/components/mapControls';
import Header from '@/components/header'
import { useAuth } from '@/context/AuthContext'; // Still needed for AppContent
import React, { useState } from 'react';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [animal, setAnimal] = useState('');

  const handleAnimalChange =  (newAnimal: string) => {
    console.log('New Animal Selected: ', newAnimal);
    console.log(typeof newAnimal);
    setAnimal(newAnimal);
  }

  // You can now use the user and loading state to conditionally render content.
  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="font-sans flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      <Header />
      <MapContainer animalName={animal}/>
      <MapControls animalChange={handleAnimalChange}/>
      {/* Example of showing user info */}
      <div className="fixed bottom-4 left-30 z-10 p-2 bg-white rounded-md shadow-md">
        {user ? (
          <p>Logged in as: {user.email}</p>
        ) : (
          <p>Please log in to see more features.</p>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
      <AppContent />
    
  );
}
