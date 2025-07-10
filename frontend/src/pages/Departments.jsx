import { useState, useEffect } from 'react';

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/departments/fetch-departments');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

      const response = await fetch('/api/departments/create-department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newDepartment = await response.json();

      // Add the new department to the list
      setDepartments(prev => [...prev, newDepartment]);

      // Reset form
      setFormData({
        name: ''
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
      name: ''
    });
    setFormError(null);
  };

  if (loading) {
    return (
      <div>
        <p>Loading departments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error loading departments: {error}</p>
      </div>
    );
  }

  if (departments.length === 0 && !showForm) {
    return (
      <div>
        <h3>No Departments Found</h3>
        <p>There are currently no departments available to display.</p>
        <button onClick={() => setShowForm(true)}>
          Add Department
        </button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div>
        <h2>Add New Department</h2>

        {formError && (
          <div>
            <p>Error: {formError}</p>
          </div>
        )}

        <div className='login-container login'>
          <div className='input-box'>
            <label htmlFor="department-name">Department Name:</label>
            <input
              type="text"
              id="department-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='input-box'>
            <label htmlFor="department-slug">Department Slug:</label>
            <input
              type="text"
              id="department-slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <button onClick={handleSubmit} disabled={formLoading} className='primary-styled-button'>
              {formLoading ? 'Creating...' : 'Create Department'}
            </button>
            <button onClick={handleCancel} className='primary-styled-button'>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='col-white'>
      <h1>Departments List</h1>

      <div>
        <h2>Available Departments ({departments.length})</h2>
        <button onClick={() => setShowForm(true)} className='primary-styled-button'>
          Add Department
        </button>
      </div>

      <ul>
        {departments.map((department) => (
          <li key={department._id}>
            <div className='card-1x1 teacher-card'>
              <h3>{department.name} ({department.slug})</h3>
              <p>Created: {new Date(department.createdAt).toLocaleDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};