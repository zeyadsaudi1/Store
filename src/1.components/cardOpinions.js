import '../4.style/components/card-opinions.css'
export default function CardOpinions(props) {
    const renderStars = (rate) => {
        const stars = [];
        for (let i = 0; i < rate; i++) {
            if(i >= 5) {
                break
            }
            else {
                stars.push(
                    <i className="fa-solid fa-star"></i>
                );
            }
        }
        return stars;
    };

    return (
        <div className="card-opinions">
            <div style={{backgroundImage: `url(${props.img})`}} className="img-person"></div>
            <div className="content">
                <h3>{props.fullName}</h3>
                <p>{renderStars(props.rate)}</p>
                <p>{props.comment}</p>
            </div>
        </div>
    );
}
