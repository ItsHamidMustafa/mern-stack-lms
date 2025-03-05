import React, { useState } from 'react'

export const Search = () => {

    const [query, setQuery] = useState('');

    return (
        <form className='search-element-container' onSubmit={(e) => { e.preventDefault() }}>
            <div className='input-box'>
                <input
                    name='search'
                    type="search"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value) }}
                    placeholder='Search something'
                />
                <button className='primary-styled-button-sm' type='submit'><span className='material-symbols-outlined'>send</span></button>
            </div>
        </form>
    )
}