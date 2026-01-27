'use client';

import { useState } from 'react';
import { PatientVitals } from '@/types';
import { AlertCircle, Calendar, Users } from 'lucide-react';

interface PatientVitalsFormProps {
  onSubmit: (vitals: PatientVitals) => void;
  isSubmitting: boolean;
}

const PatientVitalsForm: React.FC<PatientVitalsFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<PatientVitals>({
    temperature: 37,
    systolicBP: 120,
    diastolicBP: 80,
    heartRate: 75,
    birthdate: '',
    gender: '',
    hasCough: false,
    hasHeadaches: false,
    canSmellTaste: true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.temperature < 35 || formData.temperature > 42) {
      newErrors.temperature = 'Temperature should be between 35-42°C';
    }
    if (formData.systolicBP < 70 || formData.systolicBP > 220) {
      newErrors.systolicBP = 'Systolic BP should be between 70-220 mmHg';
    }
    if (formData.diastolicBP < 40 || formData.diastolicBP > 130) {
      newErrors.diastolicBP = 'Diastolic BP should be between 40-130 mmHg';
    }
    if (formData.heartRate < 40 || formData.heartRate > 220) {
      newErrors.heartRate = 'Heart rate should be between 40-220 bpm';
    }
    if (!formData.birthdate) {
      newErrors.birthdate = 'Birthdate is required';
    } else {
      const birthdateObj = new Date(formData.birthdate);
      const today = new Date();
      if (isNaN(birthdateObj.getTime())) {
        newErrors.birthdate = 'Invalid date format';
      } else if (birthdateObj > today) {
        newErrors.birthdate = 'Birthdate cannot be in the future';
      } else if (birthdateObj.getFullYear() < 1900) {
        newErrors.birthdate = 'Birthdate year must be after 1900';
      }
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg shadow-md p-6 text-white">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          
          {/* Birthdate */}
          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium mb-1">
              Birthdate
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                className={`w-full p-2 pl-10 rounded-md bg-gray-800 text-white placeholder-gray-400 border 
                ${errors.birthdate ? 'border-red-500' : 'border-gray-600'}
                focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                max={new Date().toISOString().split('T')[0]}
                disabled={isSubmitting}
              />
              {errors.birthdate && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.birthdate}
                </p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium mb-1">
              Gender
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-4 w-4 text-gray-400" />
              </div>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full p-2 pl-10 rounded-md bg-gray-800 text-white placeholder-gray-400 border
                ${errors.gender ? 'border-red-500' : 'border-gray-600'}
                focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                disabled={isSubmitting}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.gender}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Numeric Vitals */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Numeric Vitals</h3>
        <div className="grid md:grid-cols-2 gap-4">

          {/* Temperature */}
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium mb-1">
              Temperature (°C)
            </label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              step="0.1"
              value={formData.temperature}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border 
              ${errors.temperature ? 'border-red-500' : 'border-gray-600'}
              focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              disabled={isSubmitting}
            />
            {errors.temperature && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.temperature}
              </p>
            )}
          </div>

          {/* Blood Pressure */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="systolicBP" className="block text-sm font-medium mb-1">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                id="systolicBP"
                name="systolicBP"
                value={formData.systolicBP}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border 
                ${errors.systolicBP ? 'border-red-500' : 'border-gray-600'}
                focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                disabled={isSubmitting}
              />
              {errors.systolicBP && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.systolicBP}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="diastolicBP" className="block text-sm font-medium mb-1">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                id="diastolicBP"
                name="diastolicBP"
                value={formData.diastolicBP}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border 
                ${errors.diastolicBP ? 'border-red-500' : 'border-gray-600'}
                focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                disabled={isSubmitting}
              />
              {errors.diastolicBP && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.diastolicBP}
                </p>
              )}
            </div>
          </div>

          {/* Heart Rate */}
          <div>
            <label htmlFor="heartRate" className="block text-sm font-medium mb-1">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              id="heartRate"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border
              ${errors.heartRate ? 'border-red-500' : 'border-gray-600'}
              focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              disabled={isSubmitting}
            />
            {errors.heartRate && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.heartRate}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Symptoms */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Symptoms</h3>
        <div className="space-y-3">
          
          {/* Checkboxes */}
          {[
            ["hasCough", "Has cough"],
            ["hasHeadaches", "Has headaches"],
            ["canSmellTaste", "Can smell/taste food"]
          ].map(([field, label]) => (
            <div key={field} className="flex items-center">
              <input
                type="checkbox"
                id={field}
                name={field}
                checked={(formData as any)[field]}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor={field} className="ml-2 text-sm font-medium">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Submit Patient Vitals'
          )}
        </button>
      </div>
    </form>
  );
};

export default PatientVitalsForm;