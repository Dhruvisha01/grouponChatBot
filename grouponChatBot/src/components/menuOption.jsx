
export const MenuOption = ({ img, name, onClick }) => {
    return (
        <div className="menuOption" onClick={onClick}>
            <img src={img} alt={name} />
            <p>{name}</p>
        </div>
    )
}