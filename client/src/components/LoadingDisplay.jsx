import loadingSpinner from '../assets/EF-leaf-spinner.png';

function LoadingDisplay() {
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
            <p id="loading-text">Loading may take up to 30 seconds.</p>
            <p id="loading-text-2">Thank you for your patience!</p>
        </section>
    )
}

export default LoadingDisplay;