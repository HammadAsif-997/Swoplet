import React from 'react';
import WishlistItemCard from './WishlistItemCard';

const WishlistGrid = ({
  items,
  onRemoveItem,
  bulkSelectMode,
  selectedItems,
  onSelectItem,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map(item => (
        <WishlistItemCard
          key={item.id}
          item={item}
          onRemove={onRemoveItem}
          bulkSelectMode={bulkSelectMode}
          isSelected={selectedItems.includes(item.id)}
          onSelect={onSelectItem}
        />
      ))}
    </div>
  );
};

export default WishlistGrid;