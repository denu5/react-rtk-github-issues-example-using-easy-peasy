import { Links } from 'parse-link-header';
import { Issue, IssuesResult } from 'services/github-service';
import { Action, action, Thunk, thunk } from 'easy-peasy';
import { StoreModel } from 'model';
import { Injections } from 'store';

interface IssuesState {
  issuesByNumber: Record<number, Issue>;
  currentPageIssues: number[];
  pageCount: number;
  pageLinks: Links | null;
  isLoading: boolean;
  error: string | null;
}

interface FetchIssuesPayload {
  page: number;
  org: string;
  repo: string;
}

interface FetchIssuePayload {
  issueId: number;
  org: string;
  repo: string;
}

export interface IssuesModel extends IssuesState {
  getIssueStart: Action<IssuesModel>;
  getIssuesStart: Action<IssuesModel>;
  getIssueSuccess: Action<IssuesModel, Issue>;
  getIssuesSuccess: Action<IssuesModel, IssuesResult>;
  getIssueFailure: Action<IssuesModel, string>;
  getIssuesFailure: Action<IssuesModel, string>;
  fetchIssue: Thunk<IssuesModel, FetchIssuePayload, Injections, StoreModel>;
  fetchIssues: Thunk<IssuesModel, FetchIssuesPayload, Injections, StoreModel>;
}

const issuesInitialState: IssuesState = {
  issuesByNumber: {},
  currentPageIssues: [],
  pageCount: 0,
  pageLinks: {},
  isLoading: false,
  error: null
};

const issuesModel: IssuesModel = {
  ...issuesInitialState,
  getIssueStart: action(startLoading),
  getIssuesStart: action(startLoading),
  getIssueSuccess: action((state, payload) => {
    const { number } = payload;
    state.issuesByNumber[number] = payload;
    state.isLoading = false;
    state.error = null;
  }),
  getIssuesSuccess: action((state, payload) => {
    const { pageCount, issues, pageLinks } = payload;
    state.pageCount = pageCount;
    state.pageLinks = pageLinks;
    state.isLoading = false;
    state.error = null;

    issues.forEach(issue => {
      state.issuesByNumber[issue.number] = issue;
    });

    state.currentPageIssues = issues.map(issue => issue.number);
  }),
  getIssueFailure: action(loadingFailed),
  getIssuesFailure: action(loadingFailed),
  fetchIssue: thunk(
    async (actions, payload, { injections, getStoreActions }) => {
      const { githubService } = injections;
      const { org, repo, issueId } = payload;
      try {
        actions.getIssuesStart();
        const issue = await githubService.getIssue(org, repo, issueId);
        actions.getIssueSuccess(issue);
        // TODO not sure if right place
        getStoreActions().comments.fetchComments(issue);
      } catch (err) {
        actions.getIssueFailure(err.toString());
      }
    }
  ),
  fetchIssues: thunk(
    async (actions, payload, { injections, getStoreActions }) => {
      const { org, repo, page } = payload;
      const { githubService } = injections;
      try {
        actions.getIssuesStart();
        const issues = await githubService.getIssues(org, repo, page);
        actions.getIssuesSuccess(issues);
      } catch (err) {
        actions.getIssuesFailure(err.toString());
      }
      // TODO not sure if right place
      getStoreActions().repoDetails.fetchIssuesCount({ org, repo });
    }
  )
};

function startLoading(state: IssuesState) {
  state.isLoading = true;
}

function loadingFailed(state: IssuesState, payload: string) {
  state.isLoading = false;
  state.error = payload;
}

export default issuesModel;
