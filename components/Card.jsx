function Card({ imgURL, description }) {
  return (
    <div className="bg-primary p-1">
      <img src={imgURL} alt={description} />
    </div>
  );
}

export default Card;
