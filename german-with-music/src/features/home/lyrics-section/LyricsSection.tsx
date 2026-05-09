import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import Container from "react-bootstrap/Container";
import { LyricsDisplay } from "@/components/lyrics-display/LyricsDisplay";
import { SAMPLE_LYRICS } from "@/features/home/data/sample-lyrics";
import { SECTION_IDS } from "@/lib/section-ids";
import styles from "./LyricsSection.module.scss";

export function LyricsSection() {
  return (
    <section id={SECTION_IDS.lyrics} className="py-5 bg-body-secondary">
      <Container className="px-3 px-md-4">
        <div className={`mx-auto ${styles.container}`}>
          <div className="text-center mb-4">
            <p
              className={`small fw-medium text-german-red text-uppercase mb-2 ${styles.kicker}`}
            >
              Exemplo
            </p>
            <h2 className={`h1 fw-bold mb-1 ${styles.title}`}>
              99 Luftballons
            </h2>
            <p className="small text-body-secondary mb-0">Nena • 1983</p>
          </div>

          <Card className="border shadow-sm">
            <CardBody className="p-4">
              <LyricsDisplay lyrics={SAMPLE_LYRICS} />
            </CardBody>
          </Card>
        </div>
      </Container>
    </section>
  );
}
