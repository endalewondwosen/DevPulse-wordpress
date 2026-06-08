import type { Post } from '../../types';
import { PROJECT_SKELETON_COUNT } from '../../lib/constants';
import { ProjectCard } from '../ProjectCard';
import { ProjectSkeleton } from '../ProjectSkeleton';
import { TabLoadingPanel } from '../ui/TabLoadingPanel';

interface ProjectsTabProps {
  loading: boolean;
  loadingMessage: string;
  showSlowConnectionWarning: boolean;
  projects: Post[];
  onPostClick: (id: number) => void;
}

export function ProjectsTab({
  loading,
  loadingMessage,
  showSlowConnectionWarning,
  projects,
  onPostClick,
}: ProjectsTabProps) {
  if (loading) {
    return (
      <TabLoadingPanel
        title="Loading projects"
        loadingMessage={loadingMessage}
        showSlowConnectionWarning={showSlowConnectionWarning}
        skeleton={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: PROJECT_SKELETON_COUNT }, (_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        }
      />
    );
  }

  return (
    <>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onClick={() => onPostClick(project.id)} />
      ))}
    </>
  );
}
