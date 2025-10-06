

const Services = () => {
  const services = [
    {
      icon: 'bi-search',
      title: 'OSINT TikTok Avancé',
      desc: 'Analyse massive, extraction comportementale, détection de réseaux toxiques.'
    },
    {
      icon: 'bi-robot',
      title: 'Scraping Industriel',
      desc: 'Collecte à grande échelle, archivage forensique & monitoring temps réel.'
    },
    {
      icon: 'bi-shield-check',
      title: 'Détection de la Haine',
      desc: 'IA pour détecter et archiver les discours haineux automatiquement.'
    }
  ];

  return (
    <section style={{background: 'var(--color-card)', padding: '4rem 0'}}>
      <div className="container">
        <h2 className="text-center mb-5 brand">Nos Services</h2>
        <div className="row">
          {services.map((service, index) => (
            <div key={index} className="col-md-4">
              <div className="service-card p-4 text-center">
                <i className={`${service.icon} display-4 mb-3`} style={{color: 'var(--color-accent2)'}}></i>
                <h4 style={{color: 'var(--color-accent)'}}>{service.title}</h4>
                <p>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
