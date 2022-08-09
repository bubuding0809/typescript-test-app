import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

const listData = [
  {
    id: "1",
    title: "Item 1",
    description: "Item 1 description",
  },
  {
    id: "2",
    title: "Item 2",
    description: "Item 2 description",
  },
  {
    id: "3",
    title: "Item 3",
    description: "Item 3 description",
  },
  {
    id: "4",
    title: "Item 4",
    description: "Item 5 description",
  },
  {
    id: "5",
    title: "Item 5",
    description: "Item 5 description",
  },
];

type Item = {
  id: string;
  title: string;
  description: string;
};

interface DraggableItemProps {
  item: Item;
  provided: DraggableProvided;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  provided,
}: DraggableItemProps) => {
  return (
    <div
      className="flex gap-2 border-2 border-gray-200 rounded-md shadow-lg p-2 bg-white"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <strong>{item.id}.</strong>
      <div className="flex flex-col w-full items-start">
        <h1>{item.title}</h1>
        <p>{item.description}</p>
      </div>
    </div>
  );
};

export const DragDropList = () => {
  const [list, setList] = useState(listData);

  const handleDrop = (result: DropResult) => {
    const { destination, source } = result;

    // if item is dropped outside of the list, do nothing
    if (!destination) {
      return;
    }

    // if the source is the same as the destination, do nothing
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    // Create a new array of items from the list state
    const newList = [...list];

    // Splice source item from the array at the source index
    const [removed] = newList.splice(source.index, 1);

    // Insert removed item into the array at the destination index
    newList.splice(destination.index, 0, removed);

    //Update the list state with the new array
    setList(newList);
  };

  return (
    <DragDropContext onDragEnd={handleDrop}>
      <Droppable droppableId="droppable_list_1">
        {provided => (
          // Droppble area
          <div
            className="flex flex-col gap-2 w-full max-w-md"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {list.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {provided => <DraggableItem item={item} provided={provided} />}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
