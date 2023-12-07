import { PlusCircleIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: { [key in TypedColumn]: string } = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

function Column({ id, todos, index }: Props) {
  const [searchString, setNewTaskType] = useBoardStore((state) => [
    state.searchString,
    state.setNewTaskType,
  ]);
  const openModal = useModalStore((state) => state.openModal);

  const [isSortedByDate, setIsSortedByDate] = useState(false);
  const [isSortedByImportance, setIsSortedByImportance] = useState(false);
  const [sortType, setSortType] = useState("none"); // Default to sorting by date

  const importanceOrder = {
    important: 1,
    "semi-important": 2,
    "not-important": 3,
    default: 4,
  };

  const getTodos = () => {
    let sortedTodos = [...todos];
    switch (sortType) {
      case "date":
        sortedTodos.sort(
          (a, b) =>
            new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
        );
        break;
      case "importance":
        sortedTodos.sort(
          (a, b) =>
            (importanceOrder[a.importance || "default"] as number) -
            (importanceOrder[b.importance || "default"] as number)
        );
        break;
      // No case for 'none', as the default unsorted order is desired
    }
    return sortedTodos;
  };

  const toggleSortByImportance = () => {
    setIsSortedByImportance(!isSortedByImportance);
    if (isSortedByDate) {
      setIsSortedByDate(false);
    }
  };

  const toggleSortByDate = () => {
    setIsSortedByDate(!isSortedByDate);
    if (isSortedByImportance) {
      setIsSortedByImportance(false);
    }
  };

  const handleAddTodo = () => {
    setNewTaskType(id);
    openModal();
  };

  return (
    // <Draggable draggableId={id} index={index}>
    //   {(provided) => (
    //     <div
    //       {...provided.draggableProps}
    //       {...provided.dragHandleProps}
    //       ref={provided.innerRef}
    //     >
    // REMOVE DIV LINE 41 AND PUT DRAGGABLE, AT BOTTOM ALSO
    <div>
      <Droppable droppableId={index.toString()} type="card">
        {(provided, snapshot) => (
          <div className="ml-2 mr-2 mb-2">
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`p-2 rounded-none ${
                snapshot.isDraggingOver
                  ? "bg-green-200/40 rounded-xl"
                  : "border-b-2 bg-[#F8F0E5] rounded-xl border-[#102C57]/30 shadow "
              }`}
            >
              {" "}
              <h2 className="flex justify-between items-center text-sm font-semibold text-[#102C57] border-2text-xl">
                <div className="flex justify-center items-center">
                  <span className="rounded-full ml-1 ">
                    (
                    {!searchString
                      ? todos.length
                      : todos.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                        ).length}
                    )
                  </span>
                  <p className="ml-1">{idToColumnText[id]}</p>
                </div>
                <div className="flex items-center justify-center">
                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="ml-2 border border-gray-300 p-1 rounded-xl text-xs"
                  >
                    <option value="none">Free</option>
                    <option value="date">Date</option>
                    <option value="importance">Priority</option>
                  </select>

                  <div className="flex items-end justify-end p-2">
                    <button
                      title="Add New"
                      onClick={handleAddTodo}
                      className="group cursor-pointer outline-none hover:rotate-90 duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30px"
                        height="30px"
                        viewBox="0 0 24 24"
                        className="stroke-lime-400 fill-none  group-active:stroke-lime-500 group-active:duration-0 duration-300"
                      >
                        <path
                          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                          stroke-width="1.5"
                        ></path>
                        <path d="M8 12H16" stroke-width="1.5"></path>
                        <path d="M12 16V8" stroke-width="1.5"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </h2>
              <div className="space-y-2">
                {getTodos().map((todo, index) => {
                  if (
                    searchString &&
                    !todo.title
                      .toLowerCase()
                      .includes(searchString.toLowerCase())
                  )
                    return null;
                  return (
                    <Draggable
                      key={todo.$id}
                      draggableId={todo.$id}
                      index={index}
                    >
                      {(provided) => (
                        <TodoCard
                          todo={todo}
                          index={index}
                          id={id}
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            </div>
          </div>
        )}
      </Droppable>
    </div>
    //   )}
    // </Draggable>
  );
}

export default Column;
