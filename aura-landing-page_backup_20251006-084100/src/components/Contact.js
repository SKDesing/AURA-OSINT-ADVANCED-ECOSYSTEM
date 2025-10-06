

const Contact = () => {
  return (
    <section style={{background: 'var(--color-card)', padding: '4rem 0'}}>
      <div className="container text-center">
        <h2 className="mb-4" style={{color: 'var(--color-accent)'}}>Contact & Démo</h2>
        <p className="mb-4">Kaabache Soufiane – contact@tiktokliveanalyser.com</p>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Nom / Organisation" />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Email" />
              </div>
              <div className="mb-3">
                <textarea className="form-control" placeholder="Votre message..." rows="4"></textarea>
              </div>
              <button type="submit" className="btn btn-gradient">Envoyer</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
