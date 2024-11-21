// src/pages/Reminders.js
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

function Reminders() {

  const [sortBy, setSortBy] = useState("Creation Date");
  const [filterBy, setFilterBy] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSortChange = (event) => {
    setSortBy(event.target.value); // Update sortBy state when sort dropdown changes
  };

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value); // Update filterBy state when filter dropdown changes
  };

  const fetchTasks = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      const response = await axios.get(`http://localhost:8000/tasks?user_id=${currentUser.userId}&sort_by=${sortBy}&filter_by=${filterBy}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.tokens.idToken}`,
        },
      });

      setTasks(response.data); // Set tasks to the state
      setLoading(false); // Set loading to false when data is loaded
    } catch (err) {
      setError("Failed to fetch tasks");
      setLoading(false); // Set loading to false even on error
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [sortBy, filterBy]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const currentUser = await getCurrentUser();
    const session = await fetchAuthSession();

    const formData = new FormData(event.target);
    const task = Object.fromEntries(formData.entries());
    task.owner_id = currentUser.userId;
    task.completed = false;
    if (task.deadline.length === 0) {
      task.deadline = null;
    }
    console.log("Task Submitted:", task);

    try {
      // Make an HTTP POST request to save the task
      const response = await axios.post("http://localhost:8000/tasks", task, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.tokens.idToken}`,
        },
      });

      const createdTask = await response.data;
      console.log("Task Created Successfully:", createdTask);

      // Close the modal on success
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create task:", error.message);
    }
  };

  return (
    <div className="min-h-full">
      <NavBar />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {isModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Add New Task</h2>
                </div>
                <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
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
                      onClick={handleCloseModal}
                      className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="px-4 py-3 sm:px-0">
            {/* Task List Section */}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold mb-4">Task List</h2>
                <div>
                  <button
                    onClick={handleOpenModal}
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 
                    px-3 py-1.5 text-sm font-semibold leading-6 text-white 
                    shadow-sm hover:bg-indigo-500 focus-visible:outline 
                    focus-visible:outline-2 focus-visible:outline-offset-2 
                    focus-visible:outline-indigo-600"
                  >
                    Add New Task
                  </button>
                </div>
              </div>
              {/* Sorting and Filtering Options */}
              <div className="mb-4 flex space-x-4">
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium leading-6 text-gray-900">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    value={sortBy}
                    onChange={handleSortChange} //
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 
                    text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 
                    focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="Creation Date">Creation Date</option>
                    <option value="Deadline">Deadline</option>
                    <option value="Completion Status">Completion Status</option>
                    <option value="Priority">Priority</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="filter" className="block text-sm font-medium leading-6 text-gray-900">
                    Filter:
                  </label>
                  <select
                    id="filter"
                    name="filter"
                    value={filterBy}
                    onChange={handleFilterChange}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 
                    text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 
                    focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="All">All</option>
                    <option value="Completed">Completed</option>
                    <option value="Incomplete">Incomplete</option>
                  </select>
                </div>
              </div>
              <hr className="border-t border-gray-300 my-4" />

              {loading && (
                <div className="text-center py-4">
                  <span className="text-gray-500">Loading...</span>
                </div>
              )}

              {error && (
                <div className="text-center py-4">
                  <span className="text-red-500">{error}</span>
                </div>
              )}

              {!loading && !error && tasks.length > 0 && (
                <ul className="divide-y divide-gray-100">
                  {/* Task Items */}
                  {tasks.map((task) => (
                    <li key={task.id} className="flex justify-between gap-x-6 py-5">
                      <div className="flex min-w-0 gap-x-4">
                        {task.completed && (
                          <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">{task.title}</p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500">{task.description}</p>
                        </div>
                      </div>
                      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        {task.priority !== 'none' && (
                          <p className="text-sm leading-6 text-gray-900">{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</p>
                        )}
                        {!task.completed ? (
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {task.deadline && <span>Deadline: </span>}
                            <span>{task.deadline && <time dateTime={task.deadline}>{task.deadline}</time> }</span>
                          </p>
                        ) : (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              <span>Completed: </span>
                              <span>{task.completed_at ? <time dateTime={task.completed_at}>{task.completed_at}</time> : "None"}</span>
                            </p>
                          )}
                      </div>
                      <div className="flex items-center gap-x-2">
                        {!task.completed && (
                          <button
                            type="button"
                            className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-green-500"
                          >
                            Complete
                          </button>
                        )}
                        <button type="button" className="rounded bg-yellow-600 px-2 py-1 text-xs font-semibold text-white">
                          Edit
                        </button>
                        <button type="button" className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reminders;
