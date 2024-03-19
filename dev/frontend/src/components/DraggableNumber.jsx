// DraggableNumber.jsx
import { useDrag } from 'react-dnd';

const DraggableNumber = ({ id, number }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'number',
    item: { id, number },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="bg-gray-200 hover:bg-gray-400 text-black-800 cursor-move w-10 h-10 flex justify-center items-center text-xl rounded border"
      // Added border for better visibility, adjust bg and text colors as per theme
    >
      {number}
    </div>
  );
};

export default DraggableNumber;
