// src/pages/Reminders.js
import React, { useState, useEffect, useCallback } from 'react';
import NavBar from '../components/NavBar';
import TaskModal from '../components/TaskModal';
import FilterSortOptions from '../components/FilterSortOptions';
import TaskList from '../components/TaskList';
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { completeUserTask, createUserTask, deleteUserTask, getUserTasks, updateUserTask } from '../services/api';

function Reminders() {
  const [sortBy, setSortBy] = useState("Creation Date");
  const [filterBy, setFilterBy] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentTask, setCurrentTask] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null); // Reset current task when modal closes
  };

  const fetchTasks = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      const response = await getUserTasks(currentUser.userId, filterBy, sortBy, session.tokens.idToken); 

      setTasks(response); // Set tasks to the state
      setLoading(false); // Set loading to false when data is loaded
    } catch (err) {
      setError("Failed to fetch tasks");
      setLoading(false); // Set loading to false even on error
    }
  }, [sortBy, filterBy]);

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
      // If editing an existing task, send PUT request
      if (currentTask) {
        const updatedTask = await updateUserTask(currentTask.id, task, session.tokens.idToken);
        console.log("Task Updated Successfully:", updatedTask);

        // Update the task list
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
      } else {
        // If creating a new task, send POST request
        const createdTask = await createUserTask(task, session.tokens.idToken);
        console.log("Task Created Successfully:", createdTask);

        // Add the new task to the list
        setTasks((prevTasks) => [...prevTasks, createdTask]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save task:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const session = await fetchAuthSession();

      const deletedTask = await deleteUserTask(id, session.tokens.idToken);
      console.log("Task Deleted Successfully:", deletedTask);

    } catch (error) {
      console.error("Failed to delete task:", error.message);
    }
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleComplete = async (id) => {
    try {
      const session = await fetchAuthSession();

      const taskPayload = {
        title: null,
        description: null,
        completed: true,
        deadline: null,
        priority: null 
      };

      const completedTask = await completeUserTask(id, taskPayload, session.tokens.idToken);
      console.log("Task Completed:", completedTask);

    } catch (error) {
      console.error("Failed to complete task:", error.message);
    }
    setTasks((prevTasks) => prevTasks.map((task) => task.id === id ? { ...task, completed: true} : task));
  };

  const handleEdit = async (task) => {
    setCurrentTask(task);
    handleOpenModal();
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-full">
      <NavBar />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <TaskModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={(e) => handleTaskSubmission(e)}
            task={currentTask}
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
              <TaskList 
                tasks={tasks} 
                loading={loading} 
                error={error} 
                onDelete={handleDelete} 
                onComplete={handleComplete}
                onEdit={handleEdit}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reminders;
