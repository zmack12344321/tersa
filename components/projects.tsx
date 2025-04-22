import type { projects } from '@/schema';
import { Panel } from '@xyflow/react';
import { ProjectSelector } from './project-selector';
import { ProjectSettings } from './project-settings';

type ProjectsProps = {
  projects: (typeof projects.$inferSelect)[];
  currentProject: string;
};

export const Projects = ({ projects, currentProject }: ProjectsProps) => {
  const currentProjectData = projects.find(
    (project) => project.id === Number(currentProject)
  );

  if (!currentProjectData) {
    return null;
  }

  return (
    <Panel position="top-left" className="flex items-center gap-2">
      <div className="flex items-center rounded-full border bg-card/90 p-1 drop-shadow-xs backdrop-blur-sm">
        <ProjectSelector projects={projects} currentProject={currentProject} />
      </div>
      <div className="flex items-center rounded-full border bg-card/90 p-1 drop-shadow-xs backdrop-blur-sm">
        <ProjectSettings data={currentProjectData} />
      </div>
    </Panel>
  );
};
