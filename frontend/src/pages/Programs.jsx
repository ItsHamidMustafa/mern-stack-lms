import { useState, useEffect } from 'react';

export const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    departmentId: '',
    duration: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchPrograms();
    fetchDepartments();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/programs/fetch-programs');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPrograms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments/fetch-departments');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    setFormError(null);

    try {
      const token = JSON.parse(localStorage.getItem('token'));
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/programs/create-program', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          departmentId: formData.departmentId,
          duration: parseInt(formData.duration)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newProgram = await response.json();
      
      // Add the new program to the list
      setPrograms(prev => [...prev, newProgram]);
      
      // Reset form
      setFormData({
        name: '',
        departmentId: '',
        duration: ''
      });
      setShowForm(false);
      
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      name: '',
      departmentId: '',
      duration: ''
    });
    setFormError(null);
  };

  if (loading) {
    return (
      <div>
        <p>Loading programs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error loading programs: {error}</p>
      </div>
    );
  }

  if (programs.length === 0 && !showForm) {
    return (
      <div>
        <h3>No Programs Found</h3>
        <p>There are currently no programs available to display.</p>
        <button onClick={() => setShowForm(true)}>
          Add Program
        </button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div>
        <h2>Add New Program</h2>
        
        {formError && (
          <div>
            <p>Error: {formError}</p>
          </div>
        )}
        
        <div>
          <div>
            <label htmlFor="name">Program Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="departmentId">Department:</label>
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a department</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="duration">Duration (years):</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          
          <div>
            <button onClick={handleSubmit} disabled={formLoading}>
              {formLoading ? 'Creating...' : 'Create Program'}
            </button>
            <button onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='col-white'>
      <h1>Programs List</h1>
      
      <div>
        <h2>Available Programs ({programs.length})</h2>
        <button onClick={() => setShowForm(true)} className='primary-styled-button'>
          Add Program
        </button>
      </div>
      
      <ul>
        {programs.map((program) => (
          <li key={program._id}>
            <div>
              <h3>{program.name}</h3>
              <p>Duration: {program.duration} years</p>
              <p>Created: {new Date(program.createdAt).toLocaleDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};