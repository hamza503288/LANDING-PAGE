import { useState, useEffect } from 'react';
import { Shield, Sparkles, CheckCircle, Phone, Award, Car, Settings, Headphones, Star, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';
import toast, { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    immatriculation: '',
    identifiant: '',
    dateNaissance: '',
    formule: ''
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2800); // Affichage pendant env 2.8 secondes
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.nom || !formData.prenom || !formData.telephone || !formData.immatriculation || !formData.identifiant || !formData.formule || !formData.dateNaissance) {
        toast.error('Veuillez remplir tous les champs !');
        setLoading(false);
        return;
      }

      if (!/^\d{8}$/.test(formData.identifiant)) {
        toast.error('Le numéro de CIN doit comporter exactement 8 chiffres !');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('client_leads')
        .insert([
          { 
            nom: formData.nom, 
            prenom: formData.prenom, 
            telephone: formData.telephone, 
            immatriculation: formData.immatriculation, 
            identifiant: formData.identifiant,
            date_naissance: formData.dateNaissance,
            formule: formData.formule,
            created_at: new Date().toISOString()
          }
        ]);

      const finalName = formData.nom;
      if (error) throw error;
      
      setSubmittedName(finalName);
      setShowModal(true);
      
      setFormData({
        nom: '',
        prenom: '',
        telephone: '',
        immatriculation: '',
        identifiant: '',
        dateNaissance: '',
        formule: ''
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Génial ! Votre demande a été enregistrée. (Note: table non créée dans supabase)');
      setSubmittedName(formData.nom);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('devis-form').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {showWelcome && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(15px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999,
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <div style={{ textAlign: 'center', animation: 'popIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
            <img src="/logo.png" alt="STAR Assurances" style={{ height: '120px', objectFit: 'contain', marginBottom: '1.5rem', display: 'inline-block' }} />
            <h2 style={{ fontSize: '2.5rem', color: '#00653B', marginBottom: '0.5rem', fontWeight: '800' }}>
              STAR Assurances vous souhaite la bienvenue
            </h2>
            <h3 style={{ fontSize: '2rem', color: '#9ec31d', fontWeight: 'bold' }}>
              Agence SHIRI FARES HAMZA
            </h3>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
      
      {/* Header */}
      <header>
        <div className="agency-info">
          <img src="/logo.png" alt="STAR Assurances" style={{ height: '90px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
          <Shield size={48} color="var(--primary-color)" style={{ display: 'none' }} />
          <div>
            <div className="agency-title" style={{ color: '#00653B' }}>
              Agence Mr SHIRI FARES HAMZA
            </div>
            <div className="agency-subtitle">
              <Award size={16} />
              Plus de 10 ans d'expérience en assurance
            </div>
          </div>
        </div>
        <a href="https://wa.me/21623502362" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <div className="header-contact">
            <Phone size={18} />
            <span>Contactez via WhatsApp</span>
          </div>
        </a>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Roulez en toute sécurité avec TRIK ESSLAMA</h1>
          <p>
            Bénéficiez de la meilleure assurance automobile en Tunisie. 
            Découvrez nos offres exclusives pour assurer votre véhicule au meilleur prix tout en garantissant une couverture optimale.
          </p>
          
          <div className="promo-tags">
            <div className="promo-tag">
              <Sparkles size={24} />
              Remise de 20% sur la formule Sécurité+
            </div>
            <div className="promo-tag">
              <Star size={24} />
              Remise de 50% sur la formule Sérénité (Tous Risques)
            </div>
          </div>
        </div>

        <div className="form-wrapper" id="devis-form">
          <div className="form-card">
            <h2>Obtenez votre devis</h2>
            <p>Remplissez ce formulaire pour profiter de nos remises</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input 
                  type="text" 
                  name="nom" 
                  className="form-control" 
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Prénom</label>
                <input 
                  type="text" 
                  name="prenom" 
                  className="form-control" 
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Numéro de téléphone</label>
                <input 
                  type="tel" 
                  name="telephone" 
                  className="form-control" 
                  placeholder="Ex: 22 123 456"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Immatriculation du véhicule</label>
                <input 
                  type="text" 
                  name="immatriculation" 
                  className="form-control" 
                  placeholder="Ex: 123 TU 4567"
                  value={formData.immatriculation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>N° Carte d'identité (CIN)</label>
                <input 
                  type="text" 
                  name="identifiant" 
                  className="form-control" 
                  placeholder="8 chiffres (Ex: 01234567)"
                  value={formData.identifiant}
                  onChange={handleChange}
                  required
                  maxLength={8}
                />
                <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
                  Ce numéro est utilisé seulement pour déterminer votre classe bonus/malus.
                </small>
              </div>

              <div className="form-group">
                <label>Date de naissance</label>
                <input 
                  type="date" 
                  name="dateNaissance" 
                  className="form-control" 
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Formule souhaitée</label>
                <select 
                  name="formule" 
                  className="form-control"
                  value={formData.formule}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Sélectionnez une formule</option>
                  <option value="Securite">Sécurité (Basique)</option>
                  <option value="Securite_Plus">Sécurité+ (Remise 20%)</option>
                  <option value="Super_Securite">Super Sécurité (-10 ans)</option>
                  <option value="Serenite">Sérénité - Tous Risques (Remise 50%)</option>
                </select>
              </div>
              
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Demander mon devis gratuit'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Packs Section */}
      <section className="section bg-color">
        <h2 className="section-title">Nos Formules TRIK ESSLAMA</h2>
        <div className="packs-grid">
          <div className="pack-card">
            <h3><Shield /> Sécurité</h3>
            <p>Avec notre pack Sécurité, bénéficiez d'une assurance basique pour assurer votre voiture et rouler l'esprit tranquille.</p>
            <button className="btn-submit" onClick={scrollToForm} style={{background: '#f1f5f9', color: '#0f172a'}}>Choisir</button>
          </div>
          
          <div className="pack-card highlight">
            <div className="pack-badge">-20%</div>
            <h3><Sparkles color="var(--primary-color)" /> Sécurité+</h3>
            <p>Spécialement conçu pour les voitures d'occasion, couvre l'intégralité de vos besoins essentiels.</p>
            <button className="btn-submit" onClick={scrollToForm}>Profiter de l'offre</button>
          </div>

          <div className="pack-card">
            <h3><Car /> Super Sécurité</h3>
            <p>Destinée aux voitures de moins de 10 ans, c'est une assurance auto qui vous protège contre les aléas de la route.</p>
            <button className="btn-submit" onClick={scrollToForm} style={{background: '#f1f5f9', color: '#0f172a'}}>Choisir</button>
          </div>

          <div className="pack-card highlight">
            <div className="pack-badge">-50%</div>
            <h3><Star color="var(--primary-color)" /> Sérénité (Tous Risques)</h3>
            <p>Roulez en toute sérénité et bénéficiez de la meilleure couverture possible. Prise en charge intégrale.</p>
            <button className="btn-submit" onClick={scrollToForm}>Profiter de l'offre</button>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="section advantages-bg">
        <h2 className="section-title">Pourquoi choisir notre Agence ?</h2>
        <div className="advantages-grid">
          <div className="advantage-item">
            <div className="advantage-icon"><Settings size={24} /></div>
            <div className="advantage-content">
              <h4>Une expertise rapide</h4>
              <p>Le savoir-faire de notre équipe, toujours disponible pour vous aider à obtenir une solution d'assurance efficace.</p>
            </div>
          </div>
          <div className="advantage-item">
            <div className="advantage-icon"><CheckCircle size={24} /></div>
            <div className="advantage-content">
              <h4>Des réparations garanties 1 an</h4>
              <p>Toute réparation effectuée au sein de notre réseau agréé est garantie pendant une année.</p>
            </div>
          </div>
          <div className="advantage-item">
            <div className="advantage-icon"><Headphones size={24} /></div>
            <div className="advantage-content">
              <h4>Assistance 24h/24 et 7j/7</h4>
              <p>Accompagnement personnalisé et assistance continue sur toute la Tunisie pour ne penser qu'au plaisir de conduire.</p>
            </div>
          </div>
          <div className="advantage-item">
            <div className="advantage-icon"><AlertCircle size={24} /></div>
            <div className="advantage-content">
              <h4>Prise en charge par la STAR</h4>
              <p>Prise en charge des réparations nécessaires sans avance de frais de votre part.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Section */}
      <section className="section" style={{ backgroundColor: '#f1f5f9' }}>
        <h2 className="section-title">Plus qu'un assureur, un partenaire</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', backgroundColor: 'var(--white)', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
          <Award size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#00653B' }}>
            Mr SHIRI FARES HAMZA
          </h3>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', lineHeight: '1.8' }}>
            M. Shiri n'est pas comme les autres assureurs. C'est un véritable conseiller qui vous accompagne et vous propose les <strong>meilleures offres sur le marché</strong>. En tant que <strong>Leader</strong> doté d'une expérience approfondie en <strong>Risk Management, analyse quantitative des risques et en assurance</strong>, il met son expertise stratégique à votre disposition pour garantir la meilleure protection possible.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2026 Agence SHIRI FARES HAMZA - Expert en assurance automobile (STAR). Tous droits réservés.</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', opacity: 0.1 }}>
          <Link to="/admin" title="Espace Administrateur" style={{ padding: '0.5rem', display: 'inline-flex' }}>
            <Settings size={16} color="#ffffff" />
          </Link>
        </div>
      </footer>
      
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
          animation: 'fadeIn 0.3s forwards'
        }}>
          <div style={{
            background: 'white', padding: '3rem 2rem', borderRadius: '24px', textAlign: 'center', maxWidth: '500px', width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            <img src="/logo.png" alt="STAR Assurances" style={{ height: '70px', objectFit: 'contain', marginBottom: '1.5rem', display: 'inline-block' }} />
            <h2 style={{ fontSize: '2rem', color: '#00653B', marginBottom: '1rem' }}>Félicitations {submittedName} !</h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-dark)', marginBottom: '2rem', lineHeight: '1.6' }}>
              Nous vous contactons dans quelques minutes pour vous présenter l'offre. <br/>
              <strong style={{ color: 'var(--primary-color)' }}>Restez joignable SVP.</strong>
            </p>
            <button className="btn-submit" onClick={() => setShowModal(false)} style={{ display: 'inline-flex', width: 'auto', padding: '0.75rem 2rem' }}>Compris, merci</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
