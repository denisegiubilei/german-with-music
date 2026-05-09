import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { HOW_IT_WORKS_STEPS } from "@/features/home/data/how-it-works-steps";
import { SECTION_IDS } from "@/lib/section-ids";
import styles from "./HowItWorks.module.scss";

export function HowItWorks() {
  return (
    <section id={SECTION_IDS.howItWorks} className="py-5">
      <Container className="px-3 px-md-4">
        <div className="text-center mb-5">
          <h2 className={`h1 fw-bold mb-3 ${styles.title}`}>
            Como Funciona
          </h2>
          <p className="text-body-secondary mb-0">
            Quatro passos simples para aprender alemão.
          </p>
        </div>

        <Row className="g-4">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <Col key={step.title} xs={6} lg={3}>
              <div
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`d-flex align-items-center justify-content-center rounded-circle bg-body-secondary mx-auto mb-3 ${styles.iconWrap}`}
                >
                  <step.icon
                    className="text-german-gold flex-shrink-0"
                    size={20}
                    aria-hidden
                  />
                </div>
                <div className="small fw-medium text-german-red mb-1">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="fw-semibold small mb-1">{step.title}</h3>
                <p className="small text-body-secondary mb-0">
                  {step.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
