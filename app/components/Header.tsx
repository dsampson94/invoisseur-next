import React from 'react';

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4 text-center flex shadow-xl items-center justify-center">
            <img
                src="/inv-logo.png"
                className="h-10 w-auto mr-4"
                alt="logo"/>
            <div>
                <h1 className="text-3xl font-bold">Invoisseur</h1>
            </div>
        </header>
    );
};

export default Header;
