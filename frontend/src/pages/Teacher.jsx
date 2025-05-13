import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import loadingGif from '../media/loader.gif';

export const Teacher = () => {
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const res = await fetch(`/api/teachers/fetch/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.msg || 'Error fetching teacher');
                }

                setTeacher(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchTeacher();
    }, [id]);

    if (error) return <div className="error">{error}</div>;
    if (!teacher) return (
        <div className='loading-container'>
            <img src={loadingGif} alt="loading..." className='loading' />
        </div>
    )

    return (
        <div className="teacher-card-container">
            <h2>{teacher.firstName} {teacher.lastName}</h2>
            <span><strong>Date of Birth:</strong>{" "}
                {teacher?.dob && new Date(teacher.dob).toLocaleDateString('en-US', {
                    dateStyle: 'medium',
                })}
            </span>
            <span><strong>Subject:</strong> {teacher.subject}</span>
            <span><strong>Email:</strong> {teacher.email}</span>
            <span><strong>Gender:</strong> {teacher.gender}</span>
            <span><strong>Reg No:</strong> {teacher.regno}</span>
            <span><strong>Contact:</strong> {teacher.contactNum}</span>
            <span>
                <strong>Joined at:</strong>{" "}
                {teacher?.joinedAt && new Date(teacher.joinedAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    // timezone can also be added here
                })}
            </span>
            <span><strong>Is working? </strong>{teacher.isWorking ? 'Yes' : 'No'}</span>
        </div>
    );
};

export default Teacher;