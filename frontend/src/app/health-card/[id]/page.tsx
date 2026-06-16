import { supabase } from '@/lib/supabase';

export default async function PublicHealthCard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: patient, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !patient) return <div className="p-8 text-center">Record not found.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 border-b pb-4">Patient Medical History</h1>
      
      {/* 1. Basic Information Section */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-sm font-semibold text-blue-600 mb-3">Basic Profile</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><span className="text-gray-400">Name:</span> {patient.name}</p>
          <p><span className="text-gray-400">Age:</span> {patient.age}</p>
          <p><span className="text-gray-400">Gender:</span> {patient.gender}</p>
          <p><span className="text-gray-400">Blood Group:</span> {patient.blood_group}</p>
          <p><span className="text-gray-400">Phone:</span> {patient.phone}</p>
          <p><span className="text-gray-400">Last Visit:</span> {patient.last_visit}</p>
        </div>
      </div>

      {/* 2. Detailed Medical Analysis Section */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-sm font-semibold text-blue-600 mb-3">Medical Analysis</h2>
        <div className="space-y-4">
          <p className="font-medium text-gray-900">Condition: {patient.condition}</p>
          
          <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg">
            <p>BP: {patient.bp}</p>
            <p>Glucose: {patient.glucose}</p>
            <p>Pulse: {patient.pulse}</p>
            <p>Temp: {patient.temp}</p>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm italic text-gray-700">
  {patient.history && patient.history.length > 0 
    ? `"${patient.history[0].note}"` 
    : "No clinical notes available."}
</p>
          </div>
        </div>
      </div>
    </div>
  );
}