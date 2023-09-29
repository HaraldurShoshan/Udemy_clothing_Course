import './cart-item.styles.scss';
const CartItem = ({ cartItem }) => {
	const { name, quantity, price, imageUrl } = cartItem;
	return (
		<div className="cart-item-container">
			<img src={cartItem.imageUrl} alt={`${name}`} />
			<div className="item-details">
				<span className="name">{name}</span>
				<span className="price">
					{quantity} * ${price}
				</span>
			</div>
		</div>
	);
};

export default CartItem;
