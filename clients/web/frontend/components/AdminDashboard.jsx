import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        loadStats();
        if (activeSection === 'users') loadUsers();
        if (activeSection === 'profiles') loadProfiles();
    }, [activeSection]);

    const loadStats = async () => {
        try {
            const response = await fetch('/admin/api/stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            setStats({ users: 5, profiles: 150, investigations: 12, logs_24h: 1247 });
        }
    };

    const loadUsers = async () => {
        try {
            const response = await fetch('/admin/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setUsers([
                { id_utilisateur: 1, nom_utilisateur: 'admin', email: 'admin@aura.local', role: 'admin', statut: 'actif' }
            ]);
        }
    };

    const loadProfiles = async () => {
        try {
            const response = await fetch('/admin/api/profiles');
            const data = await response.json();
            setProfiles(data);
        } catch (error) {
            setProfiles([
                { id_utilisateur: 1, pseudo_tiktok: 'test_user', nom_complet: 'Test User', nombre_abonnes: 15000 }
            ]);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2 bg-dark text-white p-0" style={{ minHeight: '100vh' }}>
                    <div className="p-3">
                        <h4><i className="fas fa-shield-alt"></i> AURA Admin</h4>
                    </div>
                    <nav className="nav flex-column">
                        {[
                            { key: 'dashboard', icon: 'tachometer-alt', label: 'Dashboard' },
                            { key: 'users', icon: 'users', label: 'Utilisateurs' },
                            { key: 'profiles', icon: 'tiktok', label: 'Profils TikTok' },
                            { key: 'investigations', icon: 'search', label: 'Investigations' },
                            { key: 'logs', icon: 'file-alt', label: 'Logs' },
                            { key: 'config', icon: 'cog', label: 'Configuration' }
                        ].map(item => (
                            <a key={item.key} 
                               className={`nav-link text-white ${activeSection === item.key ? 'bg-primary' : ''}`}
                               href="#" 
                               onClick={(e) => { e.preventDefault(); setActiveSection(item.key); }}>
                                <i className={`fa${item.key === 'profiles' ? 'b' : 's'} fa-${item.icon}`}></i> {item.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="col-md-10 p-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
                    {activeSection === 'dashboard' && (
                        <div>
                            <h2><i className="fas fa-tachometer-alt"></i> Dashboard AURA</h2>
                            <div className="row mb-4">
                                {[
                                    { label: 'Utilisateurs', value: stats.users, icon: 'users', color: 'primary' },
                                    { label: 'Profils TikTok', value: stats.profiles, icon: 'tiktok', color: 'success', brand: true },
                                    { label: 'Investigations', value: stats.investigations, icon: 'search', color: 'warning' },
                                    { label: 'Logs 24h', value: stats.logs_24h, icon: 'file-alt', color: 'info' }
                                ].map((stat, index) => (
                                    <div key={index} className="col-md-3">
                                        <div className={`card bg-${stat.color} text-white`}>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <h4>{stat.value || 0}</h4>
                                                        <p>{stat.label}</p>
                                                    </div>
                                                    <i className={`fa${stat.brand ? 'b' : 's'} fa-${stat.icon} fa-2x`}></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'users' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2><i className="fas fa-users"></i> Gestion Utilisateurs</h2>
                                <button className="btn btn-primary">
                                    <i className="fas fa-user-plus"></i> Nouvel Utilisateur
                                </button>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th><th>Nom d'utilisateur</th><th>Email</th><th>Rôle</th><th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.id_utilisateur}>
                                                    <td>{user.id_utilisateur}</td>
                                                    <td>{user.nom_utilisateur}</td>
                                                    <td>{user.email}</td>
                                                    <td><span className="badge bg-info">{user.role}</span></td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-primary me-1">
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'profiles' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2><i className="fab fa-tiktok"></i> Profils TikTok</h2>
                                <button className="btn btn-success">
                                    <i className="fas fa-plus"></i> Nouveau Profil
                                </button>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th><th>Pseudo</th><th>Nom complet</th><th>Abonnés</th><th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {profiles.map(profile => (
                                                <tr key={profile.id_utilisateur}>
                                                    <td>{profile.id_utilisateur}</td>
                                                    <td>@{profile.pseudo_tiktok}</td>
                                                    <td>{profile.nom_complet}</td>
                                                    <td>{profile.nombre_abonnes?.toLocaleString()}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-primary me-1">
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {['investigations', 'logs', 'config'].includes(activeSection) && (
                        <div className="alert alert-info">
                            Section {activeSection} en développement
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;