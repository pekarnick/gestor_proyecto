import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'Planificación';
      case 'in-progress':
        return 'En Progreso';
      case 'completed':
        return 'Completado';
    }
  };

  const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
  const progress = project.tasks.length ? (completedTasks / project.tasks.length) * 100 : 0;

  return (
    <div
      onClick={() => onClick(project)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
          {getStatusText(project.status)}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          <span>Iniciado: {new Date(project.startDate).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          <span>{completedTasks} de {project.tasks.length} tareas completadas</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>{project.tasks.filter(t => t.priority === 'high').length} tareas de alta prioridad</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}