import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (
    firstName,
    lastName,
    email,
    fatherName,
    password,
    dateOfBirth,
    cnic,
    contactNumber,
    gender,
    nationality,
    selectedProgram,
    address
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/signup-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          fatherName,
          password,
          dateOfBirth,
          cnic,
          contactNumber,
          gender,
          nationality,
          selectedProgram,
          address,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Signup failed');
      }

      localStorage.setItem('token', JSON.stringify(json.token));

      dispatch({ type: 'LOGIN', payload: json });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
