import { useDrop } from 'react-dnd';
import { useState, useEffect } from 'react';

const DroppableCell = ({ onDrop, children, cellId, currentValue }) => {
  const [hoverInvalid, setHoverInvalid] = useState(false);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'number',
    drop: (item, monitor) => {
      setHoverInvalid(false);
      if (!currentValue) {
        onDrop(cellId, item.number); 
      }
    },
    hover: (item, monitor) => {
      const isOverCurrent = monitor.isOver({ shallow: true });
      if (isOverCurrent && !canDrop && !currentValue) {
        setHoverInvalid(true); 
      }
    },
    canDrop: (item, monitor) => !currentValue, 
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [currentValue]); 

  useEffect(() => {
    if (!isOver) {
      setHoverInvalid(false);
    }
  }, [isOver]);

  let backgroundColor = 'bg-white';
  if (hoverInvalid) {
    backgroundColor = 'bg-gray-200';
  } else if (isOver && canDrop) {
    backgroundColor = 'bg-gray-200';
  }

  return (
    <div
      ref={drop}
      className={`border-2 border-black flex justify-center items-center ${backgroundColor}`}
      style={{ width: '100px', height: '100px', lineHeight: '50px'}}
    >
      {children}
    </div>
  );
};

export default DroppableCell;
