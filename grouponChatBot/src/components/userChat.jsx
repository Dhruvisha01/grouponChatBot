export const UserChat = ({ msg }) => {
    return (

        <div className="userMessage">
            <p className="inter-regular" dangerouslySetInnerHTML={{ __html: msg }}></p>
        </div>
    )
}