import type { Post } from '../../types';
import { SnippetItem } from '../SnippetItem';
import { SnippetSkeleton } from '../ProjectSkeleton';
import { TabLoadingPanel } from '../ui/TabLoadingPanel';

interface SnippetsTabProps {
  loading: boolean;
  loadingMessage: string;
  showSlowConnectionWarning: boolean;
  snippets: Post[];
  onPostClick: (id: number) => void;
}

export function SnippetsTab({
  loading,
  loadingMessage,
  showSlowConnectionWarning,
  snippets,
  onPostClick,
}: SnippetsTabProps) {
  if (loading) {
    return (
      <TabLoadingPanel
        title="Loading Code Lab"
        loadingMessage={loadingMessage}
        showSlowConnectionWarning={showSlowConnectionWarning}
        skeleton={
          <>
            <SnippetSkeleton />
            <SnippetSkeleton />
          </>
        }
      />
    );
  }

  return (
    <>
      {snippets.map((snippet) => (
        <SnippetItem key={snippet.id} snippet={snippet} onClick={() => onPostClick(snippet.id)} />
      ))}
    </>
  );
}
