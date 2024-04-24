import { useDrag } from 'react-dnd';

const DraggableNumber = ({ id, number, onRemove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'number',
    item: { id, number },
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        onRemove(id);  // Ensure we pass the correct identifier
      }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="bg-gray-200 hover:bg-gray-400 text-black-800 cursor-move w-10 h-10 flex justify-center items-center text-xl rounded border"
    >
      {number}
    </div>
  );
};

export default DraggableNumber;