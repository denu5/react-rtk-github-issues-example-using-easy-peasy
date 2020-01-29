import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import classnames from 'classnames';

import { insertMentionLinks } from 'utils/stringUtils';
import { IssueLabels } from 'components/IssueLabels';

import { IssueMeta } from './IssueMeta';
import { IssueComments } from './IssueComments';

import styles from './IssueDetailsPage.module.css';
import './IssueDetailsPage.css';
import { useStoreState, useStoreActions } from 'store/hooks';
import shallowEqual from 'shallowequal';

interface IDProps {
  org: string;
  repo: string;
  issueId: number;
  showIssuesList: () => void;
}

export const IssueDetailsPage = ({
  org,
  repo,
  issueId,
  showIssuesList
}: IDProps) => {
  const { fetchIssue } = useStoreActions(actions => actions.issues);
  const { fetchComments } = useStoreActions(actions => actions.comments);

  const issue = useStoreState(state => state.issues.issuesByNumber[issueId]);

  const { commentsLoading, commentsError, comments } = useStoreState(state => {
    return {
      commentsLoading: state.comments.loading,
      commentsError: state.comments.error,
      comments: state.comments.commentsByIssue[issueId]
    };
  }, shallowEqual);

  useEffect(() => {
    // handled in store
    // if (!issue) {
    //   fetchIssue({ org, repo, issueId });
    // }
    window.scrollTo({ top: 0 });
  }, [org, repo, issueId, issue, fetchIssue]);

  // useEffect(() => {
  //   if (issue) {
  //     fetchComments(issue)
  //   }
  // }, [issue, dispatch])

  let content;

  const backToIssueListButton = (
    <button className="pure-button" onClick={showIssuesList}>
      Back to Issues List
    </button>
  );

  if (issue === null) {
    content = (
      <div className="issue-detail--loading">
        {backToIssueListButton}
        <p>Loading issue #{issueId}...</p>
      </div>
    );
  } else {
    let renderedComments;

    if (comments) {
      renderedComments = <IssueComments issue={issue} comments={comments} />;
    } else if (commentsLoading) {
      renderedComments = (
        <div className="issue-detail--loading">
          <p>Loading comments...</p>
        </div>
      );
    } else if (commentsError) {
      renderedComments = (
        <div className="issue-detail--error">
          <h1>Could not load comments for issue #{issueId}</h1>
          <p>{commentsError.toString()}</p>
        </div>
      );
    }

    content = (
      <div className={classnames('issueDetailsPage', styles.issueDetailsPage)}>
        <h1 className="issue-detail__title">{issue.title}</h1>
        {backToIssueListButton}
        <IssueMeta issue={issue} />
        <IssueLabels labels={issue.labels} className={styles.issueLabels} />
        <hr className={styles.divider} />
        <div className={styles.summary}>
          <ReactMarkdown
            className={'testing'}
            source={insertMentionLinks(issue.body)}
          />
        </div>
        <hr className={styles.divider} />
        <ul>{renderedComments}</ul>
      </div>
    );
  }

  return <div>{content}</div>;
};
