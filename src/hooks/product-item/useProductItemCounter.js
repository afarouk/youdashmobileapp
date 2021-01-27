import { useState } from 'react';

export default () => {
  const [quantity, setQuantity] = useState(1);
  const handleQtyPlus = () => setQuantity(quantity + 1);
  const handleQtyMinus = () => (quantity > 1 ? setQuantity(quantity - 1) : setQuantity(1));
  return [quantity, setQuantity, handleQtyPlus, handleQtyMinus];
};
