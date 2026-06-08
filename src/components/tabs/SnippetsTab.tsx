import type { Post } from '../../types';
import { SNIPPET_SKELETON_COUNT } from '../../lib/constants';
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
            {Array.from({ length: SNIPPET_SKELETON_COUNT }, (_, i) => (
              <SnippetSkeleton key={i} />
            ))}
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
