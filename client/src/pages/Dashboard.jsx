import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {

    const { user } = useContext(AuthContext);
    console.log(`user: ${user}`)

    return (
        <div>
            <h1>{user.name}'s Dashboard</h1>
        </div>
    );
}

export default Dashboard;