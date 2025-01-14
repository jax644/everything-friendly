import { useEffect, useState } from 'react';
import './LoadingDisplay.css';
import loadingSpinner from './assets/EF-leaf-spinner.png';

function LoadingDisplay() {

    const [messsage1Visible, setMessage1Visible] = useState(false);
    const [message2Visible, setMessage2Visible] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setMessage1Visible(true);
        }, 3000);

        const timer2 = setTimeout(() => {
            setMessage2Visible(true);
        }, 6000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }), [];

    return (
        <section className="loading-container">
            <img className="leaf-spinner" src={loadingSpinner} alt="Everything-Friendly logo spinning to signify loading"/><br/><br/>
            <h1 id="loading">
                <span>l</span>
                <span>o</span>
                <span>a</span>
                <span>d</span>
                <span>i</span>
                <span>n</span>
                <span>g</span>
            </h1>
            {messsage1Visible && <p>Loading may take up to 30 seconds.</p>}
            {message2Visible && <p>Thank you for your patience!</p>}
        </section>
    )
}

export default LoadingDisplay;