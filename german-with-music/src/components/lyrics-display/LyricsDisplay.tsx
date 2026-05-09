import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import type { LyricLine } from "@/types/lyrics";
import styles from "./LyricsDisplay.module.scss";

export interface LyricsDisplayProps {
  lyrics: LyricLine[];
}

export function LyricsDisplay({ lyrics }: LyricsDisplayProps) {
  return (
    <div className="d-flex flex-column gap-4">
      {lyrics.map((line) => (
        <div key={line.german} className="lyric-line p-3 p-md-4">
          <Row className="g-3">
            <Col xs={12} md={6}>
              <div
                className={`small text-uppercase text-primary fw-medium mb-1 ${styles.label}`}
              >
                Deutsch
              </div>
              <p className="fw-medium fs-5 mb-0 text-body">{line.german}</p>
            </Col>
            <Col xs={12} md={6}>
              <div
                className={`small text-uppercase text-body-secondary fw-medium mb-1 ${styles.label}`}
              >
                Português
              </div>
              <p className="fs-5 mb-0 text-body-secondary">{line.portuguese}</p>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
}
