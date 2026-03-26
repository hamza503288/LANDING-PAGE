import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Shield, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');

  // Mot de passe très simple pour protéger l'accès
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'star123') {
      setAuth(true);
      fetchLeads();
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const handleTraiter = async (id) => {
    const nomAgent = window.prompt("Demande traitée par qui ? (Ex: Fares)");
    if (!nomAgent) return;

    try {
      const { error } = await supabase
        .from('client_leads')
        .update({ status: 'Traité', traite_par: nomAgent })
        .eq('id', id);

      if (error) throw error;
      
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status: 'Traité', traite_par: nomAgent } : lead));
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Erreur de chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Nom', 'Prénom', 'Téléphone', 'Immatriculation', 'Puissance_CV', 'Formule', 'Statut', 'Traite_Par'];
    const rows = leads.map(l => [
      new Date(l.created_at).toLocaleString(),
      l.nom,
      l.prenom,
      l.telephone,
      l.immatriculation,
      l.puissance,
      l.formule,
      l.status || 'Nouveau',
      l.traite_par || ''
    ]);
    
    // Ajout du BOM UTF-8 pour supporter les accents sur Excel
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_assurance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!auth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <Shield size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1.5rem', color: '#00653B' }}>Espace Administrateur</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
            />
            <button type="submit" className="btn-submit" style={{ padding: '0.75rem' }}>Connexion</button>
          </form>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.875rem' }}>&larr; Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ color: '#0f172a', display: 'flex', alignItems: 'center', textDecoration: 'none' }}><ArrowLeft /> Retour</Link>
          <h1 style={{ color: '#00653B', margin: 0 }}>Dashboard Demandes de Devis</h1>
        </div>
        <button onClick={exportCSV} className="btn-submit" style={{ width: 'auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} /> Exporter CSV
        </button>
      </header>

      {loading ? (
        <p>Chargement des données...</p>
      ) : leads.length === 0 ? (
        <p>Aucune demande de devis pour le moment.</p>
      ) : (
        <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Nom</th>
                <th style={{ padding: '1rem' }}>Prénom</th>
                <th style={{ padding: '1rem' }}>Téléphone</th>
                <th style={{ padding: '1rem' }}>Puissance (CV)</th>
                <th style={{ padding: '1rem' }}>Immatriculation</th>
                <th style={{ padding: '1rem' }}>Formule</th>
                <th style={{ padding: '1rem' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{lead.nom}</td>
                  <td style={{ padding: '1rem' }}>{lead.prenom}</td>
                  <td style={{ padding: '1rem' }}>{lead.telephone}</td>
                  <td style={{ padding: '1rem', color: '#64748b', fontWeight: 'bold' }}>{lead.puissance} CV</td>
                  <td style={{ padding: '1rem' }}>{lead.immatriculation}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      {lead.formule.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {(lead.status === 'Traité') ? (
                      <span style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                        Traité par {lead.traite_par}
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleTraiter(lead.id)}
                        style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
                      >
                        Marquer Traité
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
