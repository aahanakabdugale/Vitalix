// frontend/src/components/health-card.tsx
'use client';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface HealthCardProps {
  patientId: string;
  name: string;
  bloodGroup: string;
  condition: string;
}

export const HealthCard = ({ patientId, name, bloodGroup, condition }: HealthCardProps) => {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    // This only runs on the client, where 'window' exists
    setOrigin(window.location.origin );
  }, []);

  // Use the state for the URL
  const publicUrl = origin ? `${origin}/health-card/${patientId}` : '';

  return (
    <div className="p-6 border rounded-xl bg-white shadow-sm w-full max-w-sm">
      <h2 className="text-lg font-bold mb-4">Smart Health Card</h2>
      <div className="flex justify-center mb-4">
        {/* Only render QR if we have the origin */}
        {origin ? (
          <QRCodeSVG value={publicUrl} size={200} />
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center text-xs text-gray-400">Loading...</div>
        )}
      </div>
      <div className="space-y-1">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">Blood Group: {bloodGroup}</p>
        <p className="text-sm text-gray-500">Condition: {condition}</p>
      </div>
    </div>
  );
};