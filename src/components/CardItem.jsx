export default function CardItem({ card }) {
  return (
    <div className="feature-card">
      <img src={card.image} alt={card.title} />
      <div className="card-content">
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <button>Explore</button>
      </div>
    </div>
  );
}