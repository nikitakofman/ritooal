"use client";

import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { getURL } from "next/dist/shared/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import "animate.css";
import { useDarkMode } from "../contexts/DarkModeProvider";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function getCardColor(importance) {
  switch (importance) {
    case "important":
      return "bg-[#e09c98] dark:bg-[#88304E] dark:text-white"; // or any red shade
    case "semi-important":
      return "bg-[#e8d3a2] dark:bg-[#B0A565] dark:text-white"; // or any orange shade
    case "not-important":
      return "bg-[#B2D4AC] dark:bg-[#3B5349] dark:text-white"; // or any yellow shade
    case "no-color":
      return "bg-white dark:bg-[#6E7881] dark:text-white"; // No color
    default:
      return "bg-white dark:bg-[#6E7881] dark:text-white"; // default color
  }
}

function TodoCard({
  todo,
  index,
  id,

  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const { darkMode } = useDarkMode();
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  function showAlert(options) {
    const swalOptions = darkMode
      ? {
          ...options,
          customClass: {
            ...options.customClass,
            popup: "swal2-dark",
          },
        }
      : options;

    return Swal.fire(swalOptions);
  }

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };

      fetchImage();
    }
  }, [todo]);

  const [date, setDate] = useState("");
  const [update, setUpdate] = useState("No updates yet");

  const options: any = {
    weekday: "long", // e.g., Monday
    year: "numeric", // e.g., 2023
    month: "long", // e.g., December
    day: "numeric", // e.g., 5
    hour: "2-digit", // e.g., 02
    minute: "2-digit", // e.g., 47
    second: "2-digit", // e.g., 36
  };

  useEffect(() => {
    const options: any = {
      weekday: "long", // e.g., Monday
      year: "numeric", // e.g., 2023
      month: "long", // e.g., December
      day: "numeric", // e.g., 5
      hour: "2-digit", // e.g., 02
      minute: "2-digit", // e.g., 47
      second: "2-digit", // e.g., 36
    };

    const date = new Date(todo.$createdAt);
    setDate(date.toLocaleString(undefined, options));
  }, [todo.$createdAt]);

  useEffect(() => {
    if (todo && todo.$updatedAt) {
      const updatedTime: any = new Date(todo.$updatedAt);
      if (!isNaN(updatedTime)) {
        setUpdate(updatedTime.toLocaleString(undefined, options));
      } else {
        setUpdate("Update time not available");
      }
    }
  }, [todo.$updatedAt]);

  const [isUploading, setIsUploading] = useState(false);

  const openModal = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      // Prevent event from bubbling up only if an event is provided
      event.stopPropagation();
    }

    showAlert({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ED5E68",
      cancelButtonColor: "#6E7881",
      confirmButtonText: "Yes, delete it!",
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(index, todo, id);
        showAlert({
          title: "Deleted!",
          text: "Your task has been deleted.",
          icon: "success",
          showConfirmButton: false, // Add this line to hide the "OK" button
          timer: 1000, // Optional: close the modal automatically after 1.5 seconds
        });
      }
    });
  };

  const openDetails = () => {
    type SwalOptions = {
      text: string;
      showConfirmButton: boolean;
      confirmButtonText: string;
      confirmButtonColor: string;
      showCancelButton: boolean;
      cancelButtonText: string;
      cancelButtonColor: string;
      didOpen: any;
      imageUrl?: string;
      imageAlt?: string;
    };

    const swalOptions = {
      text: todo.title,
      html: `<div class="flex flex-col justify-between">
      <pre style="white-space: pre-wrap; text-align: left; line-height: 1.5; font-family: 'Open Sans';">${todo.title.replace(
        /\n/g,
        "<br>"
      )}</pre>
      <p class="text-xs italic mt-10">Updated: ${update}</p>
      <p class="text-xs italic mt-1">Created: ${date}</p>
   </div>`,
      showConfirmButton: false,
      confirmButtonText: "Close",
      confirmButtonColor: "#3085d6",
      showCloseButton: true,
      showCancelButton: true,
      showClass: {
        popup: `
        animate__animated animate__fadeIn
        `,
      },
      cancelButtonText: "Delete",
      cancelButtonColor: "",
      imageUrl: imageUrl ? imageUrl : undefined,
      imageAlt: imageUrl ? "Task Image" : undefined,
      didOpen: (modalElement) => {
        modalElement.style.animationDuration = "0.3s";
        const confirmButton = Swal.getConfirmButton();

        if (confirmButton && confirmButton.parentNode) {
          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.classList.add("swal2-confirm", "swal2-styled");
          editButton.style.backgroundColor = "#53B0DB"; // Match the color with confirm button

          editButton.onclick = () => {
            Swal.close();
            openEditModal();
          };

          // Insert the edit button before the confirm button
          confirmButton.parentNode.insertBefore(editButton, confirmButton);
        }

        if (modalElement) {
          const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            // Optionally focus on a specific element, or remove focus entirely
            // focusableElements[0].focus(); // Focus on the first focusable element
            focusableElements[0].blur(); // Remove focus from the first focusable element
          }
        }

        // Check if the parentNode of confirmButton is not null

        // Optionally adjust styles if needed
      },
    };

    // Add imageUrl only if it exists
    if (imageUrl) {
      swalOptions.imageUrl = imageUrl;
      swalOptions.imageAlt = "Task image";
    }

    showAlert(swalOptions).then((result) => {
      if (result.isConfirmed) {
        // Handle 'OK' button action
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        openModal();
      }
    });
  };

  const [uploadedFile, setUploadedFile] = useState(null);

  const openEditModal = () => {
    let uploadedFile: any = null; // Temporary storage for the uploaded file

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

    showAlert({
      title: "Edit Task",
      html: ` 

      <select id="importance-select" class="ml-2 mb-5 border text-black border-gray-300 p-1 rounded-xl">
      <option value="important" ${
        todo.importance === "important" ? "selected" : ""
      }>Important</option>
      <option value="semi-important" ${
        todo.importance === "semi-important" ? "selected" : ""
      }>Semi-Important</option>
      <option value="not-important" ${
        todo.importance === "not important" ? "selected" : ""
      }>Low importance</option>
      <option value="no-color" ${
        todo.importance === null ? "selected" : ""
      }>Default</option>


    </select>
        <textarea id="swal-input1" class="w-full bg-none text-black border-2 border-black/10 rounded-xl h-40 p-5">${
          todo.title
        }</textarea>
        <div>
      
      
      </div>
        <div class="flex items-center flex-col justify-center">
        
        <div class="w-full border-2 border-black/10 dark:border-white rounded-lg mt-4 hover:bg-neutral-400/10">
        <button type="button" id="uploadButton" class="py-2 px-2 h-[67.78px] w-full text-black rounded-md flex items-center justify-center"><img class="w-[21px] h-[16.5px]" src="/upload.png"/><p class="ml-2 text-black dark:text-white">Upload image</p></button>
        
        </div>
        <div id="imagePreviewContainer" class="flex items-center justify-center mt-2" style="margin-top: 10px; display: none;">
          <img id="imagePreview" src="" alt="Image Preview" style="max-width: 100%; max-height: 200px;">
        </div>
        <input type="file" id="imageUpload" hidden>
        <div id="loadingSpinner" style="display: none; margin-top: 10px;">
          <img src="/loading.png" alt="Loading..." style="width: 50px; height: 50px;" class="animateSpin h-10 w-10" />
        </div>
        </div>

      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#53B0DB",
      showCloseButton: true,

      preConfirm: async () => {
        const inputElement = document.getElementById(
          "swal-input1"
        ) as HTMLInputElement;
        const importanceSelect = document.getElementById(
          "importance-select"
        ) as HTMLSelectElement;

        if (inputElement && importanceSelect) {
          const newTitle = inputElement.value;
          const newImportance: any =
            importanceSelect.value !== "no-color"
              ? importanceSelect.value
              : null;

          if (newTitle && newTitle !== todo.title) {
            await useBoardStore
              .getState()
              .updateTaskTitleInDB(todo.$id, newTitle);
          }
          if (newImportance !== todo.importance) {
            await useBoardStore
              .getState()
              .updateTaskImportanceInDB(todo.$id, newImportance);
          }
          if (uploadedFile) {
            const upload: any = await useBoardStore
              .getState()
              .updateTaskImageInDB(todo.$id, uploadedFile);
            setImageUrl(upload);
          }
        }
      },
      didOpen: () => {
        const uploadButton = document.getElementById("uploadButton");
        const imageUpload = document.getElementById("imageUpload");
        const imagePreviewContainer = document.getElementById(
          "imagePreviewContainer"
        );
        const imagePreview = document.getElementById("imagePreview");
        const loadingSpinner = document.getElementById("loadingSpinner");

        if (
          uploadButton &&
          imageUpload &&
          imagePreview &&
          imagePreviewContainer &&
          loadingSpinner
        ) {
          uploadButton.addEventListener("click", () => {
            imageUpload.click();
          });

          imageUpload.addEventListener("change", (e) => {
            const fileInput = e.target as HTMLInputElement;
            if (fileInput.files && fileInput.files[0]) {
              const file = fileInput.files[0];

              // Validate file size and type
              if (
                file.size > MAX_FILE_SIZE ||
                !ALLOWED_FILE_TYPES.includes(file.type)
              ) {
                Swal.showValidationMessage(
                  "Invalid file. Please select an image up to 5MB in JPEG, PNG, or GIF format."
                );
                return;
              }

              uploadedFile = file; // Store the file for later use
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target) {
                  const imagePreviewElement = imagePreview as HTMLImageElement;
                  imagePreviewElement.src = event.target.result as string;
                  imagePreviewContainer.style.display = "block";
                  loadingSpinner.style.display = "none";
                }
              };
              reader.readAsDataURL(file);
            }
          });
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        showAlert({
          title: "Saved!",
          text: "Your task has been updated.",
          icon: "success",
          showConfirmButton: false, // Add this line to hide the "OK" button
          timer: 1000, // Optional: close the modal automatically after 1.5 seconds
        });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
      }
    });
  };

  // deleteTask(index, todo, id)

  return (
    <div
      className={`group ${getCardColor(
        todo.importance
      )} hover:bg-[#365C7E]/10 rounded-md space-y-2 drop-shadow-md`}
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      onClick={openDetails}
    >
      <div className="flex justify-between cursor-pointer items-center p-5">
        <p className="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {todo.title}
        </p>
        <div className="opacity-30 group-hover:opacity-100 group-hover:block w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ease-in-out duration-300 ">
          <img src={darkMode ? "/openiconwhite.png" : "/openicon.png"} />
        </div>
      </div>
      {imageUrl && (
        <div className="relative h-full w-full p-2 rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
}

export default TodoCard;
