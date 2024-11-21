// src/components/FilterSortOptions.js
import React from 'react';

function FilterSortOptions({ sortBy, filterBy, onSortChange, onFilterChange }) {
  return (
    <div className="flex space-x-4">
      <div>
        <label htmlFor="sort" className="block text-sm font-medium leading-6 text-gray-900">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={onSortChange}
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
          value={filterBy}
          onChange={onFilterChange}
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
  );
}

export default FilterSortOptions;
