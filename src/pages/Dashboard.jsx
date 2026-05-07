function Dashboard() {
  return (
    <>
      <div className="container mt-4">
        <h2>🐾 Mascotas perdidas</h2>

        <div className="row">
          {/* Ejemplo de card */}
          <div className="col-md-4">
            <div className="card mt-3">
              <img
                src="https://via.placeholder.com/300"
                className="card-img-top"
              />

              <div className="card-body">
                <h5>Firulais</h5>
                <p>Perro café, tamaño mediano</p>
                <button className="btn btn-warning">
                  Posible coincidencia
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <h3>Reportar mascota perdida</h3>

        <form className="mt-3">
          <input className="form-control mb-2" placeholder="Nombre mascota" />
          <input className="form-control mb-2" placeholder="Descripción" />
          <input className="form-control mb-2" type="file" />
          <button className="btn btn-primary">
            Publicar
          </button>
        </form>
      </div>
    </>
  );
}

export default Dashboard;