import { useEffect, useState } from 'react';
import loadingGif from '../media/loader.gif';

export const Profile = () => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  useEffect(() => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('token'));
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/complete-me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
          throw new Error(data.msg || 'Error fetching profile!');
        }

        setUser(data.user);
        setFormData(data.user);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    const token = JSON.parse(localStorage.getItem('token'));

    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || 'Failed to change password!');
      }

      setPasswordSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  if (error) return <div className='error'>{error}</div>;

  if (loading) {
    return (
      <div className='loading-container'>
        <img src={loadingGif} alt="loader" className='loading' />
      </div>
    );
  }

  return (
    <div className='profile-container'>
      {user ? (
        <>
          <form>
            <label htmlFor="firstName" className="col-white">
              First Name
              <input
                value={formData.firstName || ''}
                id="firstName"
                className="input-box"
                readOnly
              />
            </label>
            <label htmlFor="lastName" className="col-white">
              Last Name
              <input
                value={formData.lastName || ''}
                id="lastName"
                className="input-box"
                readOnly
              />
            </label>
            <label htmlFor="uid" className="col-white">
              UID
              <input
                value={formData.uid || ''}
                id="uid"
                className="input-box"
                readOnly
              />
            </label>
            <label htmlFor="contactNumber" className="col-white">
              Contact Number
              <input
                value={formData.contactNumber || ''}
                id="contactNumber"
                className="input-box"
                readOnly
              />
            </label>
            <label htmlFor="cnic" className="col-white">
              CNIC
              <input
                value={formData.cnic || ''}
                id="cnic"
                className="input-box"
                readOnly
              />
            </label>
          </form>
          <hr style={{ margin: '2rem 0' }} />
          <h3 className="col-white">Change Password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <label className="col-white">
              Current Password
              <input
                type="password"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="input-box"
                required
              />
            </label>
            <label className="col-white">
              New Password
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="input-box"
                required
              />
            </label>
            <button type="submit" className="primary-styled-button">
              Change Password
            </button>
            {passwordError && <p className="error">{passwordError}</p>}
            {passwordSuccess && <p className="success" onClick={() => setPasswordSuccess(null)}>{passwordSuccess}</p>}
          </form>
        </>
      ) : (
        <p>No user found!</p>
      )}
    </div>
  );
};
