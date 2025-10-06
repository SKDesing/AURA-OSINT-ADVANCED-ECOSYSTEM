

const Impact = () => {
  const stats = [
    { value: '1200', label: 'vies sauvées' },
    { value: '85000', label: 'cas détectés' },
    { value: '0.3%', label: 'faux positifs' }
  ];

  return (
    <section style={{background: 'var(--color-bg)', padding: '4rem 0'}}>
      <div className="container text-center">
        <h2 className="mb-5" style={{color: 'var(--color-accent2)'}}>Notre Impact</h2>
        <div className="row">
          {stats.map((stat, index) => (
            <div key={index} className="col-md-4">
              <div className="service-card p-4">
                <div className="display-3 mb-3" style={{color: 'var(--color-accent)'}}>{stat.value}</div>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
