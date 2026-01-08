import { useParams } from "react-router-dom";

export default function Pass() {
    const { token } = useParams();
    return (
        <div>
            <p>Pass</p>
            <p>Token: {token}</p>
        </div>
    );
}