import React from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

const EditableField = ({
  label,
  value,
  isEditing,
  onEditToggle,
  onSave,
  onCancel,
  onChange,
  bgColor,
}) => {
  return (
    <div className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${bgColor ? "bg-gray-50" : "bg-white"}`}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-gray-300 border px-3 py-1 rounded-md"
          />
        ) : (
          value
        )}
      </dd>
      <dd className="mt-1 sm:mt-0 sm:col-span-1 flex justify-end">
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={onSave}
              className="flex items-center px-3 py-1 border border-green-600 text-green-600 rounded-md text-sm hover:bg-green-100"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex items-center px-3 py-1 border border-red-600 text-red-600 rounded-md text-sm hover:bg-red-100"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onEditToggle}
            className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
        )}
      </dd>
    </div>
  );
};

export default EditableField;
