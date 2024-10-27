import React, { useState } from 'react';
import { Plus, Layout, BarChart, PlusCircle } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ProjectCard } from './components/ProjectCard';
import { TaskList } from './components/TaskList';
import { NewTaskModal } from './components/NewTaskModal';
import type { Project, Task } from './types';

function App() {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const createProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      id: Date.now().toString(),
      ...newProject,
      status: 'planning' as const,
      tasks: []
    };
    setProjects([...projects, project]);
    setNewProject({ name: '', description: '', startDate: new Date().toISOString().split('T')[0] });
    setShowNewProjectModal(false);
  };

  const addTask = (task: Omit<Task, 'id' | 'projectId'>) => {
    if (!selectedProject) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      projectId: selectedProject.id,
      ...task
    };
    
    const updatedProject = {
      ...selectedProject,
      tasks: [...selectedProject.tasks, newTask]
    };
    
    setSelectedProject(updatedProject);
    setProjects(projects.map(p =>
      p.id === selectedProject.id ? updatedProject : p
    ));
    setShowNewTaskModal(false);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    if (!selectedProject) return;
    
    const updatedTasks = selectedProject.tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    );
    
    const updatedProject = { ...selectedProject, tasks: updatedTasks };
    setSelectedProject(updatedProject);
    setProjects(projects.map(p =>
      p.id === selectedProject.id ? updatedProject : p
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Layout className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Gestor de Proyectos</h1>
            </div>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Proyecto
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProject ? (
          <div>
            <button
              onClick={() => setSelectedProject(null)}
              className="mb-6 text-gray-600 hover:text-gray-900"
            >
              ← Volver a Proyectos
            </button>
            
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                  <p className="mt-1 text-gray-600">{selectedProject.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Iniciado</p>
                    <p className="font-medium">{new Date(selectedProject.startDate).toLocaleDateString()}</p>
                  </div>
                  <BarChart className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Tareas</h3>
                <button
                  onClick={() => setShowNewTaskModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nueva Tarea
                </button>
              </div>
              <TaskList
                tasks={selectedProject.tasks}
                onStatusChange={updateTaskStatus}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={setSelectedProject}
              />
            ))}
          </div>
        )}
      </main>

      {showNewProjectModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Proyecto</h2>
            <form onSubmit={createProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
                  <input
                    type="text"
                    required
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    required
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                  <input
                    type="date"
                    required
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewTaskModal && (
        <NewTaskModal
          onClose={() => setShowNewTaskModal(false)}
          onSubmit={addTask}
        />
      )}
    </div>
  );
}

export default App;