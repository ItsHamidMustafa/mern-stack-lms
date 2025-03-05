import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { Link } from 'react-router-dom';
import { CountryList } from "../components/CountryList";

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [cnic, setCnic] = useState('');
    const [gender, setGender] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [nationality, setNationality] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [visibility, setVisibility] = useState('visibility_off');
    const [type, setType] = useState('password');
    const { signup, error, isLoading } = useSignup();

    const today = new Date();
    const fifteenYearsAgo = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());

    const handleSubmit = async (e) => {
        e.preventDefault();

        const address = {
            street: street,
            city: city,
            state: state,
            postalCode: postalCode,
        };

        await signup(firstName, lastName, email, password, dateOfBirth, cnic, gender, address, nationality, contactNumber);
    }

    const handleNationalityChange = (selectedNationality) => {
        setNationality(selectedNationality);
    }

    const handleVisibility = (e) => {
        if (e.target.innerText === 'visibility') {
            setVisibility('visibility_off');
            setType('password');
        } else {
            setVisibility("visibility");
            setType('text');
        }
    }

    return (
        <div className="login-container">
            <form className="login" onSubmit={handleSubmit}>
                <h2>Sign up</h2>
                <div className="user-first-last-name-container">
                    <div>
                        <div className="input-box">
                            <input
                                className="user-first-last-name-input"
                                id="firstName"
                                type="text"
                                onChange={(e) => { setFirstName(e.target.value) }}
                                value={firstName}
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div className="input-box">
                            <input
                                className="user-first-last-name-input"
                                id="lastName"
                                type="text"
                                onChange={(e) => { setLastName(e.target.value) }}
                                value={lastName}
                                placeholder="Enter last name"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        email
                    </span>
                    <input
                        id="signup-email"
                        type="email"
                        onChange={(e) => { setEmail(e.target.value) }}
                        value={email}
                        required
                        placeholder="Enter your email"
                        autoComplete="email"
                    />
                </div>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        lock
                    </span>
                    <input
                        id="signup-password"
                        type={type}
                        onChange={(e) => { setPassword(e.target.value) }}
                        value={password}
                        required
                        className="input-90-width"
                        placeholder="Enter your password"
                        autoComplete="new-password"
                    />
                    <span className="material-symbols-outlined col-primary" onClick={handleVisibility}>
                        {visibility}
                    </span>
                </div>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        calendar_today
                    </span>
                    <input
                        id="dateOfBirth"
                        type="date"
                        onChange={(e) => { setDateOfBirth(e.target.value) }}
                        value={dateOfBirth}
                        min={fifteenYearsAgo}
                        max={today}
                        required
                        className="w-100p"
                    />
                </div>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        id_card
                    </span>
                    <input
                        id="cnic"
                        type="text"
                        onChange={(e) => { setCnic(e.target.value) }}
                        value={cnic}
                        placeholder="Enter your CNIC"
                        required
                        maxLength={13}
                        className="w-100p"
                    />
                </div>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        phone
                    </span>
                    <input
                        id="contact-number"
                        type="text"
                        onChange={(e) => { setContactNumber(e.target.value) }}
                        value={contactNumber}
                        placeholder="Enter your phone"
                        required
                        maxLength={15}
                    />
                </div>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        wc
                    </span>
                    <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        globe
                    </span>
                    <CountryList onNationalityChange={handleNationalityChange} />
                </div>
                <h2>
                    ADDRESS
                </h2>

                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        my_location
                    </span>
                    <input
                        id="street"
                        type="text"
                        onChange={(e) => { setStreet(e.target.value) }}
                        value={street}
                        placeholder="Enter your street"
                        required
                        maxLength={40}
                        className="w-100p"
                    />
                </div>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        my_location
                    </span>
                    <input
                        id="city"
                        type="text"
                        onChange={(e) => { setCity(e.target.value) }}
                        value={city}
                        placeholder="Enter your city"
                        required
                        maxLength={40}
                        className="w-100p"
                    />
                </div>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        my_location
                    </span>
                    <input
                        id="state"
                        type="text"
                        onChange={(e) => { setState(e.target.value) }}
                        value={state}
                        placeholder="Enter your state"
                        required
                        maxLength={40}
                        className="w-100p"
                    />
                </div>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        my_location
                    </span>
                    <input
                        id="postalCode"
                        type="text"
                        onChange={(e) => { setPostalCode(e.target.value) }}
                        value={postalCode}
                        placeholder="Enter your postal code"
                        required
                        maxLength={40}
                        className="w-100p"
                    />
                </div>

                <button disabled={isLoading} className={`primary-styled-button ${isLoading && 'loading-anim'}`}>Sign up &nbsp;&rarr;</button>
                {error && <div className="error">{error}</div>}
                <span>Already have an account? <Link to='/login'>Login</Link></span>
            </form>
        </div>
    )
}

export default Signup;