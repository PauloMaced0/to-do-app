// src/components/TaskModal.js
import React from 'react';

function TaskModal({ isOpen, onClose, onSubmit, task }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            { task ? "Edit Task" : "Add New Task" }
          </h2>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
              Title
            </label>
            <div className="mt-2">
              <input
                required
                type="text"
                name="title"
                id="title"
                defaultValue={task?.title || ""}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                shadow-sm ring-1 ring-inset ring-gray-300 
                placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder=" Task title"
              />
            </div>
          </div>
          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                defaultValue={task?.description || ""}
                rows="3"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                shadow-sm ring-1 ring-inset ring-gray-300 
                placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder=" Task description"
              ></textarea>
            </div>
          </div>
          {/* Deadline Field */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium leading-6 text-gray-900">
              Deadline
            </label>
            <div className="mt-2">
              <input
                type="date"
                name="deadline"
                defaultValue={task?.deadline || ""}
                id="deadline"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                shadow-sm ring-1 ring-inset ring-gray-300 
                placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {/* Priority Field */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium leading-6 text-gray-900">
              Priority
            </label>
            <div className="mt-2">
              <select
                id="priority"
                name="priority"
                defaultValue={task?.priority || "none"}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 
                focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            >
            {task ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
