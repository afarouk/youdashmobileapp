import { useEffect, useState } from 'react';

export default (highLightedItem, itemsById) => {
  const { highLightMessage } = highLightedItem || {};
  const [item, setItem] = useState(null);
  useEffect(() => {
    if (
      !item &&
      highLightedItem &&
      itemsById &&
      itemsById[highLightedItem.itemUUID] !== undefined
    ) {
      setItem(itemsById[highLightedItem.itemUUID]);
    }
  }, [highLightedItem, itemsById]);
  return [item, highLightMessage];
};
