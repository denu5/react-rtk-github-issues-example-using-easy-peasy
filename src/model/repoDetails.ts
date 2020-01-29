import { Action, action, Thunk, thunk } from 'easy-peasy';
import { RepoDetails } from 'services/github-service';
import { CurrentRepo } from './issuesDisplay';
import { Injections } from 'store';
import { StoreModel } from 'model';

interface RepoDetailsState {
  openIssuesCount: number;
  error: string | null;
}

const initialState: RepoDetailsState = {
  openIssuesCount: -1,
  error: null
};

export interface RepoDetailsModel extends RepoDetailsState {
  getRepoDetailsSuccess: Action<RepoDetailsModel, RepoDetails>;
  getRepoDetailsFailed: Action<RepoDetailsModel, string>;
  fetchIssuesCount: Thunk<
    RepoDetailsModel,
    CurrentRepo,
    Injections,
    StoreModel
  >;
}

const repoDetailsModel: RepoDetailsModel = {
  ...initialState,
  getRepoDetailsSuccess: action((state, payload) => {
    state.openIssuesCount = payload.open_issues_count;
    state.error = null;
  }),
  getRepoDetailsFailed: action((state, payload) => {
    state.openIssuesCount = -1;
    state.error = payload;
  }),
  fetchIssuesCount: thunk(async (actions, payload, { injections }) => {
    const { org, repo } = payload;
    const { githubService } = injections;
    try {
      const repoDetails = await githubService.getRepoDetails(org, repo);
      actions.getRepoDetailsSuccess(repoDetails);
    } catch (err) {
      actions.getRepoDetailsFailed(err.toString());
    }
  })
};

export default repoDetailsModel;
