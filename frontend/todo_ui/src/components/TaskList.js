// src/components/TaskList.js
import React from 'react';

function TaskList({ tasks, loading, error, onDelete, onComplete }) {
  if (loading) {
    return <div className="text-center py-4"><span className="text-gray-500">Loading...</span></div>;
  }

  if (error) {
    return <div className="text-center py-4"><span className="text-red-500">Failed to fetch tasks</span></div>;
  }

  if (!tasks.length) {
    return <div className="text-center py-4"><span className="text-gray-500">No tasks found</span></div>;
  }

  return (
    <ul className="divide-y divide-gray-100">
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
                onClick={() => onComplete(task.id)}
              >
                Complete
              </button>
            )}
            <button type="button" className="rounded bg-yellow-600 px-2 py-1 text-xs font-semibold text-white">
              Edit
            </button>
            <button 
              type="button" 
              className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
