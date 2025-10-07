import React from 'react';

const Contact = () => {
  return (
    <section style={{background: 'var(--color-card)', padding: '4rem 0'}}>
      <div className="container text-center">
        <h2 className="mb-4" style={{color: 'var(--color-accent)'}}>Contact</h2>
        <p className="mb-4">Kaabache Soufiane – contact@tiktokliveanalyser.com</p>
        <button className="btn btn-gradient">Demander une démo</button>
      </div>
    </section>
  );
};

export default Contact;
