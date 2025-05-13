import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import loadingGif from '../media/loader.gif';

export const Teachers = () => {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [error, setError] = useState(null);
    const token = JSON.parse(localStorage.getItem('token'));


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
            <h1>Teachers</h1>

            {!loading && teachers.length === 0 ? (
                <p>No teachers available.</p>
            ) : (
                teachers.map((teacher) => {
                    return (
                        <div key={teacher._id} className='card-1x1 teacher-card'>
                            <Link to={'/teacher/' + teacher._id} className='col-white'>{teacher.firstName + " " + teacher.lastName} - [<strong>{teacher.regno}</strong>]</Link>
                        </div>
                    )
                })
            )}
        </div>
    )
}