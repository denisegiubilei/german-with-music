import Container from "react-bootstrap/Container";

export function Footer() {
  return (
    <footer className="py-4 border-top">
      <Container className="px-3 px-md-4">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-between gap-3 text-body-secondary small">
          <span>© 2024 Alemão com Música</span>
          <div className="d-flex flex-wrap justify-content-center gap-4">
            <a
              href="#"
              className="link-secondary link-underline-opacity-0 link-underline-opacity-100-hover"
            >
              Sobre
            </a>
            <a
              href="#"
              className="link-secondary link-underline-opacity-0 link-underline-opacity-100-hover"
            >
              Contato
            </a>
            <a
              href="#"
              className="link-secondary link-underline-opacity-0 link-underline-opacity-100-hover"
            >
              Privacidade
            </a>
          </div>
        </div>
      </Container>
      <div className="german-flag-bar mt-4" />
    </footer>
  );
}
