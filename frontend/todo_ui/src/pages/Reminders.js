// src/pages/Reminders.js
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import TaskModal from '../components/TaskModal';
import FilterSortOptions from '../components/FilterSortOptions';
import TaskList from '../components/TaskList';

function Reminders() {
  const [sortBy, setSortBy] = useState("Creation Date");
  const [filterBy, setFilterBy] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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

  const handleTaskSubmission = async (event) => {
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

  const handleDelete = async (id) => {
    try {
      const session = await fetchAuthSession();

      const response = await axios.delete(`http://localhost:8000/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${session.tokens.idToken}`,
        },
      });

      const deletedTask = await response.data;
      console.log("Task Deleted Successfully:", deletedTask);

    } catch (error) {
      console.error("Failed to delete task:", error.message);
    }
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, [sortBy, filterBy]);

  return (
    <div className="min-h-full">
      <NavBar />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={(e) => handleTaskSubmission(e, fetchTasks, () => setIsModalOpen(false))}
          />
          <div className="px-4 py-3 sm:px-0">
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
              <FilterSortOptions
                sortBy={sortBy}
                filterBy={filterBy}
                onSortChange={(e) => setSortBy(e.target.value)}
                onFilterChange={(e) => setFilterBy(e.target.value)}
              />
              <hr className="border-t border-gray-300 my-4" />
              <TaskList tasks={tasks} loading={loading} error={error} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reminders;
