import { useNavigate } from "react-router-dom";

function Topbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
};

return (
    <div 
    style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        borderBottom: '1px solid #eee',
    }}
>
    <input
    type="text"
    placeholder="Search..."
    style={{
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '8px 12px',
        width: '240px',
    }}
    />
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <span style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</span>
    </div>
</div>
);
}
export default Topbar;