import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

//Ratings: Likes/dislikes or out of 5?
function Chipotle() {
    const { id } = useParams();
    
    const [loading, setLoading] = useState(true);
    const [chipotle, setChipotle] = useState(null);

    useEffect(() => {
        const fetchChipotle = async () => {
          try {
            const res = await fetch(`http://localhost:3000/chipotles/${id}`);
            const data = await res.json();
            setChipotle(data);
          } catch (e) {
            console.error("Error:", e);
          } finally {
            setLoading(false);
          }
        };
    
        fetchChipotle();
    }, [id]);

    console.log(chipotle)

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h3>{chipotle.address}</h3>
            <p>{chipotle.state}</p>
            <p>{chipotle.location}</p>
        </div>
    );
}

export default Chipotle;