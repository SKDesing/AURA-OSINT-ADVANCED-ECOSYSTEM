

const Hero = () => {
  return (
    <section className="hero-section container">
      <div className="row align-items-center">
        <div className="col-lg-7">
          <h1 className="display-4 mb-4">
            <span className="brand">AURA</span><br/>
            TikTok Live Analyser
          </h1>
          <p className="lead mb-4" style={{color: 'var(--color-accent2)'}}>
            Solution forensique anti-harcèlement.<br/>
            Investigation automatisée, preuves horodatées, sécurité maximale.
          </p>
          <button className="btn btn-gradient me-3">Demander une démo</button>
          <button className="btn btn-outline-light">En savoir plus</button>
        </div>
        <div className="col-lg-5 text-center">
          <div style={{
            width: '300px',
            height: '300px',
            background: 'linear-gradient(45deg, var(--color-accent), var(--color-accent2))',
            borderRadius: '50%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            color: 'white'
          }} role="img" aria-label="Icône de sécurité AURA">
            <i className="bi bi-shield-check" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
