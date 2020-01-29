import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IssuesPageHeader } from './IssuesPageHeader';
import { IssuesList } from './IssuesList';
import { IssuePagination, OnPageChangeCallback } from './IssuePagination';
import { useStoreActions, useStoreState } from 'store/hooks';

interface ILProps {
  org: string;
  repo: string;
  page: number;
  setJumpToPage: (page: number) => void;
  showIssueComments: (issueId: number) => void;
}

export const IssuesListPage = ({
  org,
  repo,
  page = 1,
  setJumpToPage,
  showIssueComments
}: ILProps) => {
  const {
    currentPageIssues,
    isLoading,
    error: issuesError,
    issuesByNumber,
    pageCount
  } = useStoreState(state => state.issues);

  const openIssueCount = useStoreState(
    state => state.repoDetails.openIssuesCount
  );

  const issues = currentPageIssues.map(
    issueNumber => issuesByNumber[issueNumber]
  );

  if (issuesError) {
    return (
      <div>
        <h1>Something went wrong...</h1>
        <div>{issuesError.toString()}</div>
      </div>
    );
  }

  const currentPage = Math.min(pageCount, Math.max(page, 1)) - 1;

  let renderedList = isLoading ? (
    <h3>Loading...</h3>
  ) : (
    <IssuesList issues={issues} showIssueComments={showIssueComments} />
  );

  const onPageChanged: OnPageChangeCallback = selectedItem => {
    const newPage = selectedItem.selected + 1;
    setJumpToPage(newPage);
  };

  return (
    <div id="issue-list-page">
      <IssuesPageHeader
        openIssuesCount={openIssueCount}
        org={org}
        repo={repo}
      />
      {renderedList}
      <IssuePagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={onPageChanged}
      />
    </div>
  );
};
