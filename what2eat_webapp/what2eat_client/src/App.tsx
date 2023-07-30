import React from 'react';
// import logo from './logo.svg';
import logo from "./WHAT2EAT.png"
import './App.css';
import NavigationBar from './NavigationBar';

function App() {
    return (
        <div className='App'>
            <NavigationBar />
            <header className='App-header'>
                <img src={logo} className='App-logo' alt='logo' />
            <p> In the pursuit of "what to eat," we are also seeking deeper meanings.
                </p>
            </header>
        </div>
    );
}

export default App;
