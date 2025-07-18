import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import loadingGif from '../media/loader.gif';

export const Teachers = () => {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dob: '',
        fatherName: '',
        gender: '',
        department: '',
        cnic: '',
        contactNumber: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        setLoading(true);
        const fetchTeachers = async () => {
            try {
                if (user?.role === 'admin') {
                    const response = await fetch('/api/admins/fetch-teachers', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    if (!response.ok) {
                        throw new Error("Error fetching teachers!");
                    }

                    const json = await response.json();
                    setTeachers(json);
                }
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };
        fetchTeachers();
    }, [token, user.role]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch('/api/departments/fetch-departments', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error("Error fetching departments!");
                }

                const json = await response.json();
                setDepartments(json);
            } catch (err) {
                console.error("Error fetching departments:", err.message);
            }
        };
        fetchDepartments();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admins/create-teacher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Error creating teacher!");
            }

            const newTeacher = await response.json();
            setTeachers(prev => [...prev, newTeacher]);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                dob: '',
                fatherName: '',
                gender: '',
                department: '',
                cnic: '',
                contactNumber: ''
            });
            setShowForm(false);
        } catch (err) {
            setError(err.message);
        }
        setFormLoading(false);
    };

    const handleDelete = async (teacherId) => {
        if (!window.confirm('Are you sure you want to delete this teacher?')) {
            return;
        }

        setDeleteLoading(teacherId);
        setError(null);

        try {
            const response = await fetch(`/api/admins/delete-teacher/${teacherId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error("Error deleting teacher!");
            }

            setTeachers(prev => prev.filter(teacher => teacher._id !== teacherId));
        } catch (err) {
            setError(err.message);
        }
        setDeleteLoading(null);
    };

    if (loading) {
        return (
            <div className='loading-container'>
                <img src={loadingGif} alt="loading..." className='loading' />
            </div>
        )
    }

    if (error) {
        return <div className='error'>{error}</div>
    }

    return (
        <div className='teachers-container col-white'>
            <div>
                <h1>Teachers</h1>
                <button
                onClick={() => setShowForm(!showForm)}
                className='primary-styled-button'
                >
                    {showForm ? 'Cancel' : 'Add Teacher'}
                </button>
            </div>

            {showForm && (
                <div>
                    <form onSubmit={handleSubmit}>
                        <h3>Add New Teacher</h3>
                        
                        <div>
                            <label htmlFor='firstName'>First Name:</label>
                            <input
                                type='text'
                                id='firstName'
                                name='firstName'
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                autoComplete='given-name'
                            />
                        </div>

                        <div>
                            <label htmlFor='lastName'>Last Name:</label>
                            <input
                                type='text'
                                id='lastName'
                                name='lastName'
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                autoComplete='family-name'
                            />
                        </div>

                        <div>
                            <label htmlFor='email'>Email:</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                autoComplete='email'
                            />
                        </div>

                        <div>
                            <label htmlFor='password'>Password:</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                autoComplete='new-password'
                            />
                        </div>

                        <div>
                            <label htmlFor='dob'>Date of Birth:</label>
                            <input
                                type='date'
                                id='dob'
                                name='dob'
                                value={formData.dob}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor='fatherName'>Father's Name:</label>
                            <input
                                type='text'
                                id='fatherName'
                                name='fatherName'
                                value={formData.fatherName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor='gender'>Gender:</label>
                            <select
                                id='gender'
                                name='gender'
                                value={formData.gender}
                                onChange={handleInputChange}
                                required
                            >
                                <option value=''>Select Gender</option>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor='department'>Department:</label>
                            <select
                                id='department'
                                name='department'
                                value={formData.department}
                                onChange={handleInputChange}
                                required
                            >
                                <option value=''>Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor='cnic'>CNIC Number:</label>
                            <input
                                type='text'
                                id='cnic'
                                name='cnic'
                                value={formData.cnic}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor='contactNumber'>Contact Number:</label>
                            <input
                                type='tel'
                                id='contactNumber'
                                name='contactNumber'
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                autoComplete='tel'
                            />
                        </div>

                        <div>
                            <button 
                                type='submit' 
                                disabled={formLoading}
                                className='primary-styled-button'
                            >
                                {formLoading ? 'Creating...' : 'Create Teacher'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!loading && teachers.length === 0 ? (
                <p>No teachers available.</p>
            ) : (
                teachers.map((teacher) => {
                    return (
                        <div key={teacher._id} className='card-1x1 teacher-card'>
                            <Link to={'/teacher/' + teacher._id} className='col-white'>
                                {teacher.firstName + " " + teacher.lastName} [<strong>{teacher.uid}</strong>]
                            </Link>
                            <button 
                                onClick={() => handleDelete(teacher._id)}
                                disabled={deleteLoading === teacher._id}
                                className='primary-styled-button'
                            >
                                {deleteLoading === teacher._id ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    )
                })
            )}
        </div>
    )
}