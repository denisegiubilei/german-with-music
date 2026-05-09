import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SongCard } from "@/components/song-card/SongCard";
import { FEATURED_SONGS } from "@/features/home/data/featured-songs";
import { SECTION_IDS } from "@/lib/section-ids";
import styles from "./FeaturedSongs.module.scss";

export function FeaturedSongs() {
  return (
    <section id={SECTION_IDS.songs} className="py-5 bg-body-secondary">
      <Container className="px-3 px-md-4">
        <div className="text-center mb-5">
          <h2 className={`h1 fw-bold mb-3 ${styles.title}`}>
            Músicas em Destaque
          </h2>
          <p
            className={`text-body-secondary mx-auto mb-0 ${styles.subtitle}`}
          >
            Explore nossa coleção de músicas alemãs com letras e traduções.
          </p>
        </div>

        <Row className="g-3 g-md-4">
          {FEATURED_SONGS.map((song, index) => (
            <Col key={song.title} xs={6} lg={3}>
              <div
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <SongCard {...song} />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
