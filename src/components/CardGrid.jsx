import CardItem from "./CardItem";
import cards from "../data/cards";

export default function CardGrid() {
  return (
    <section className="card-grid">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </section>
  );
}