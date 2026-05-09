import { ArrowRight } from "lucide-react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import styles from "./HeroSection.module.scss";

export function HeroSection() {
  return (
    <section
      className={`d-flex align-items-center justify-content-center ${styles.section}`}
    >
      <Container className="px-3 px-md-4">
        <div className={`mx-auto text-center ${styles.inner}`}>
          <p className="small fw-medium text-german-red mb-3 animate-fade-in">
            Aprenda alemão de forma divertida
          </p>

          <h1
            className={`display-4 fw-bold mb-4 animate-fade-in ${styles.tagline}`}
          >
            Descubra o alemão através da{" "}
            <span className="text-german-gold">música</span>
          </h1>

          <p
            className={`lead text-body-secondary mb-4 animate-fade-in ${styles.lead}`}
          >
            Músicas alemãs com letras originais e tradução em português.
          </p>

          <div
            className={`d-flex flex-column flex-sm-row gap-2 justify-content-center align-items-stretch align-items-sm-center animate-fade-in mb-5 ${styles.actions}`}
          >
            <Button
              variant="dark"
              size="lg"
              className="d-inline-flex align-items-center justify-content-center"
            >
              Explorar Músicas
              <ArrowRight className="ms-2" size={16} aria-hidden />
            </Button>
            <Button variant="outline-secondary" size="lg">
              Ver Letras
            </Button>
          </div>

          <div
            className={`d-flex flex-wrap align-items-center justify-content-center gap-4 gap-md-5 animate-fade-in ${styles.stats}`}
          >
            <div className="text-center">
              <div className="fs-3 fw-bold text-german-gold">50+</div>
              <div
                className={`small text-body-secondary text-uppercase ${styles.statLabel}`}
              >
                Músicas
              </div>
            </div>
            <div
              className={`vr d-none d-sm-block opacity-25 ${styles.divider}`}
            />
            <div className="text-center">
              <div className="fs-3 fw-bold text-german-red">100%</div>
              <div
                className={`small text-body-secondary text-uppercase ${styles.statLabel}`}
              >
                Traduzidas
              </div>
            </div>
            <div
              className={`vr d-none d-sm-block opacity-25 ${styles.divider}`}
            />
            <div className="text-center">
              <div className="fs-3 fw-bold">Grátis</div>
              <div
                className={`small text-body-secondary text-uppercase ${styles.statLabel}`}
              >
                Sempre
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
