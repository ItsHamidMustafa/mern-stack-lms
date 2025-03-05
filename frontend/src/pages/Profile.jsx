import React from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

export default function Profile() {
    const { student } = useAuthContext();

    return (
        <div className='profile'>
            <h3>Account</h3>
            <div className='seperator-line-sm'></div>
            <span>Real-time information of your profile.</span>
            <strong>Profile Picture</strong>
            <div>
                <div>
                    <strong>First name:</strong> {student.firstName}
                </div>
                <div>
                    <strong>Last name:</strong> {student.lastName}
                </div>
            </div>
        </div>
    );
}