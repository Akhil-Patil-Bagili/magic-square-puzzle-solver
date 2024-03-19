import { useDrop } from 'react-dnd';

const DroppableCell = ({ onDrop, children, cellId }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'number',
    drop: (item, monitor) => onDrop(cellId, item.number),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`border-2 border-black flex justify-center items-center ${isOver ? 'bg-gray-200' : 'bg-white'}`}
      style={{ width: '100px', height: '100px', lineHeight: '50px'}}
    >
      {children}
    </div>
  );
};

export default DroppableCell;