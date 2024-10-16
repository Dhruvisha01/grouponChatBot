export const BotChat = ({ msg }) => {
    return (
        <div className="chatContent">
            <div className="botAvatar"></div>
            <div className="chatMessage">
                <p className="inter-regular" dangerouslySetInnerHTML={{ __html: msg }}></p>
            </div>
        </div>
    );
}