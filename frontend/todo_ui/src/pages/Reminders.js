// src/pages/Reminders.js
import React from 'react';
import NavBar from '../components/NavBar';

function Reminders() {
  return (
    <div className="min-h-full">
      <NavBar />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Add New Task Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
              <form className="space-y-6">
                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                    Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                                 shadow-sm ring-1 ring-inset ring-gray-300 
                                 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                                 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Task title"
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
                      rows="3"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                                 shadow-sm ring-1 ring-inset ring-gray-300 
                                 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                                 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Task description"
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                                 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 
                                 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 
                               px-3 py-1.5 text-sm font-semibold leading-6 text-white 
                               shadow-sm hover:bg-indigo-500 focus-visible:outline 
                               focus-visible:outline-2 focus-visible:outline-offset-2 
                               focus-visible:outline-indigo-600"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>

            {/* Task List Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Task List</h2>
              {/* Sorting and Filtering Options */}
              <div className="mb-4 flex space-x-4">
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium leading-6 text-gray-900">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 
                               text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 
                               focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option>Creation Date</option>
                    <option>Deadline</option>
                    <option>Completion Status</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="filter" className="block text-sm font-medium leading-6 text-gray-900">
                    Filter:
                  </label>
                  <select
                    id="filter"
                    name="filter"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 
                               text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 
                               focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option>All</option>
                    <option>Completed</option>
                    <option>Incomplete</option>
                  </select>
                </div>
              </div>
              {/* Task Items */}
              <ul className="divide-y divide-gray-100">
                {/* Task Item 1 */}
                <li className="flex justify-between gap-x-6 py-5">
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">Sample Task 1</p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        This is a sample task description.
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">High Priority</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Deadline: <time dateTime="2023-06-30">June 30, 2023</time>
                    </p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <button
                      type="button"
                      className="rounded bg-green-600 px-2 py-1 text-xs font-semibold 
                                 text-white shadow-sm hover:bg-green-500 focus-visible:outline 
                                 focus-visible:outline-2 focus-visible:outline-offset-2 
                                 focus-visible:outline-green-600"
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      className="rounded bg-yellow-600 px-2 py-1 text-xs font-semibold 
                                 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline 
                                 focus-visible:outline-2 focus-visible:outline-offset-2 
                                 focus-visible:outline-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded bg-red-600 px-2 py-1 text-xs font-semibold 
                                 text-white shadow-sm hover:bg-red-500 focus-visible:outline 
                                 focus-visible:outline-2 focus-visible:outline-offset-2 
                                 focus-visible:outline-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
                {/* Task Item 2 */}
                <li className="flex justify-between gap-x-6 py-5">
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">Sample Task 2</p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        This is another sample task description.
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">Medium Priority</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Deadline: <time dateTime="2023-07-15">July 15, 2023</time>
                    </p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <button
                      type="button"
                      className="rounded bg-yellow-600 px-2 py-1 text-xs font-semibold 
                                 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline 
                                 focus-visible:outline-2 focus-visible:outline-offset-2 
                                 focus-visible:outline-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded bg-red-600 px-2 py-1 text-xs font-semibold 
                                 text-white shadow-sm hover:bg-red-500 focus-visible:outline 
                                 focus-visible:outline-2 focus-visible:outline-offset-2 
                                 focus-visible:outline-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
                {/* Add more task items as needed */}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reminders;
