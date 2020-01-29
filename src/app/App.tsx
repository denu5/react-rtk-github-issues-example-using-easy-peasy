import React from 'react';

import { RepoSearchForm } from 'features/repoSearch/RepoSearchForm';
import { IssuesListPage } from 'features/issuesList/IssuesListPage';
import { IssueDetailsPage } from 'features/issueDetails/IssueDetailsPage';

import './App.css';
import { useStoreActions, useStoreState } from 'store/hooks';

const App: React.FC = () => {
  const {
    displayRepo,
    setCurrentPage,
    setCurrentDisplayType
  } = useStoreActions(actions => actions.issueDisplay);

  const { org, repo, displayType, page, issueId } = useStoreState(
    state => state.issueDisplay
  );

  const setOrgAndRepo = (org: string, repo: string) => {
    displayRepo({ org, repo });
  };

  const setJumpToPage = (page: number) => {
    setCurrentPage(page);
  };

  const showIssuesList = () => {
    setCurrentDisplayType({ displayType: 'issues' });
  };

  const showIssueComments = (issueId: number) => {
    setCurrentDisplayType({ displayType: 'comments', issueId });
  };

  let content;

  if (displayType === 'issues') {
    content = (
      <React.Fragment>
        <RepoSearchForm
          org={org}
          repo={repo}
          setOrgAndRepo={setOrgAndRepo}
          setJumpToPage={setJumpToPage}
        />
        <IssuesListPage
          org={org}
          repo={repo}
          page={page}
          setJumpToPage={setJumpToPage}
          showIssueComments={showIssueComments}
        />
      </React.Fragment>
    );
  } else if (issueId !== null) {
    const key = `${org}/${repo}/${issueId}`;
    content = (
      <IssueDetailsPage
        key={key}
        org={org}
        repo={repo}
        issueId={issueId}
        showIssuesList={showIssuesList}
      />
    );
  }

  return <div className="App">{content}</div>;
};

export default App;
