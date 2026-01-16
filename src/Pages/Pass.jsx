export default function Pass() {
    const { token } = useParams();
    return (
        <div>
            <p>Pass: {token} </p>
        </div>
    )
}