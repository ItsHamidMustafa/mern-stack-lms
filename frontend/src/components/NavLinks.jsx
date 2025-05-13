import React from 'react'
import { Link } from 'react-router-dom';

export const NavLinks = () => {
    return (
        <div className='navlinks'>
            <div className='nav-center-options-container'>
                <Link to='/categories' className='nav-center-option'>Categories</Link>
                <Link to='/about' className='nav-center-option'>About</Link>
                {user && user.role === 1 && (
                    <Link to="/create">
                        <abbr title='Admin Panel'>
                            <span className="material-symbols-outlined d-flex-row material-button">
                                admin_panel_settings
                            </span>
                        </abbr>
                    </Link>
                )}
                <Link to='/contact' className='nav-center-option'>Contact</Link>
            </div>
        </div>
    )
}