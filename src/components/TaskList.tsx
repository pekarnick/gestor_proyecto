import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export function TaskList({ tasks, onStatusChange }: TaskListProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'Baja';
      case 'medium':
        return 'Media';
      case 'high':
        return 'Alta';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'Por Hacer';
      case 'in-progress':
        return 'En Progreso';
      case 'completed':
        return 'Completada';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay tareas creadas aún.</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                <p className="text-gray-600 mt-1">{task.description}</p>
                
                <div className="flex items-center mt-3 space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    Prioridad {getPriorityText(task.priority)}
                  </span>
                  
                  {task.dueDate && (
                    <span className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      Vence: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  
                  {task.assignee && (
                    <span className="flex items-center text-sm text-gray-500">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Asignado a: {task.assignee}
                    </span>
                  )}
                </div>
              </div>
              
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
                className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="todo">Por Hacer</option>
                <option value="in-progress">En Progreso</option>
                <option value="completed">Completada</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
}