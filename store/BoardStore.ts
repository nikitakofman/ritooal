import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { useEffect } from "react";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  newTaskInput: string;
  newTaskType: TypedColumn;
  image: File | null;
  userId: string;

  searchString: string;
  setSearchString: (searchString: string) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;

  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;

  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  setImage: (image: File | null) => void;
  setUserId: (input: string) => void;
  updateTaskTitleInDB: (todoId: string, newTitle: string) => Promise<void>;
  updateTaskImageInDB: (todoId: string, imageFile: File) => Promise<void>;
  updateTaskImportanceInDB: (
    todoId: string,
    newImportance: string
  ) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: "",
  newTaskInput: "",
  userId: "",

  setSearchString: (searchString) => set({ searchString }),
  newTaskType: "todo",
  image: null,

  getBoard: async () => {
    const currentUserId = get().userId; // Get the current user's ID from the state
    const board = await getTodosGroupedByColumn(currentUserId);
    set({ board });
  },
  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  setImage: (image: File | null) => set({ image }),
  setUserId: (input: string) => set({ userId: input }),

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },

  updateTaskTitleInDB: async (todoId: string, newTitle: string) => {
    try {
      // Update the task's title in the Appwrite database
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todoId,
        { title: newTitle }
      );

      // Update the local state with the new title
      set((state) => {
        const newColumns = new Map(state.board.columns);

        // Iterate over each column and their todos to find and update the specific todo
        for (let [columnId, column] of newColumns.entries()) {
          const todoIndex = column.todos.findIndex(
            (todo) => todo.$id === todoId
          );
          if (todoIndex !== -1) {
            column.todos[todoIndex].title = newTitle;
            break; // Stop the loop once the todo is found and updated
          }
        }

        return { board: { columns: newColumns } };
      });
    } catch (error) {
      console.error("Error updating task title:", error);
      // Handle error appropriately (e.g., show error message to user)
    }
  },

  updateTaskImportanceInDB: async (todoId: string, newImportance: string) => {
    try {
      // Update the task's importance in the Appwrite database
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todoId,
        { importance: newImportance }
      );

      // Update the local state with the new importance
      set((state) => {
        const newColumns = new Map(state.board.columns);

        // Iterate over each column and their todos to find and update the specific todo
        for (let [columnId, column] of newColumns.entries()) {
          const todoIndex = column.todos.findIndex(
            (todo) => todo.$id === todoId
          );
          if (todoIndex !== -1) {
            column.todos[todoIndex].importance = newImportance;
            break; // Stop the loop once the todo is found and updated
          }
        }

        return { board: { columns: newColumns } };
      });
    } catch (error) {
      console.error("Error updating task importance:", error);
      // Handle error appropriately (e.g., show error message to user)
    }
  },

  updateTaskImageInDB: async (todoId: string, imageFile: File) => {
    const fileUrl = URL.createObjectURL(imageFile);

    try {
      // Upload the image and get the URL
      const fileUploaded = await uploadImage(imageFile);
      let imageUrl;

      if (fileUploaded) {
        imageUrl = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }

      // Update the task's image in the Appwrite database
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todoId,
        { image: JSON.stringify(imageUrl) }
      );

      // Update the local state with the new image URL
      set((state) => {
        const newColumns = new Map(state.board.columns);

        for (let [columnId, column] of newColumns.entries()) {
          const todoIndex = column.todos.findIndex(
            (todo) => todo.$id === todoId
          );
          if (todoIndex !== -1) {
            column.todos[todoIndex].image = imageUrl; // or the appropriate image property
            break;
          }
        }

        return { board: { columns: newColumns } };
      });

      const allinfo = imageUrl && fileUrl;
      return allinfo;
    } catch (error) {
      console.error("Error updating task image:", error);
      // Handle error appropriately
    }
  },

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    const currentUserID = get().userId;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        userId: currentUserID,
        date: new Date(),
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: any = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
}));
