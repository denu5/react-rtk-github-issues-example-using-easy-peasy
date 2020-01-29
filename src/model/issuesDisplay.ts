import { Action, action, thunkOn, ThunkOn } from 'easy-peasy';
import { StoreModel } from 'model';

interface CurrentDisplay {
  displayType: 'issues' | 'comments';
  issueId: number | null;
}

interface CurrentDisplayPayload {
  displayType: 'issues' | 'comments';
  issueId?: number;
}

export interface CurrentRepo {
  org: string;
  repo: string;
}

interface IssuesDisplayState extends CurrentRepo, CurrentDisplay {
  page: number;
}

export interface IssuesDisplayModel extends IssuesDisplayState {
  displayRepo: Action<IssuesDisplayModel, CurrentRepo>;
  setCurrentPage: Action<IssuesDisplayModel, number>;
  setCurrentDisplayType: Action<IssuesDisplayModel, CurrentDisplayPayload>;
  onDisplayRepo: ThunkOn<IssuesDisplayModel, void, StoreModel>;
  onSetCurrentPage: ThunkOn<IssuesDisplayModel, void, StoreModel>;
  onSetCurrentDisplayType: ThunkOn<IssuesDisplayModel, void, StoreModel>;
}

let initialState: IssuesDisplayState = {
  org: 'rails',
  repo: 'rails',
  page: 1,
  displayType: 'issues',
  issueId: null
};

const issuesDisplaySlice: IssuesDisplayModel = {
  ...initialState,
  displayRepo: action((state, payload) => {
    const { org, repo } = payload;
    state.org = org;
    state.repo = repo;
  }),
  setCurrentPage: action((state, payload) => {
    state.page = payload;
  }),
  setCurrentDisplayType: action((state, payload) => {
    const { displayType, issueId = null } = payload;
    state.displayType = displayType;
    state.issueId = issueId;
  }),
  onDisplayRepo: thunkOn(
    actions => actions.displayRepo,
    (actions, _, { getStoreActions, getState }) => {
      const { org, repo, page } = getState();
      getStoreActions().issues.fetchIssues({ org, repo, page });
    }
  ),
  onSetCurrentPage: thunkOn(
    actions => actions.setCurrentPage,
    (actions, _, { getStoreActions, getState }) => {
      const { org, repo, page } = getState();
      getStoreActions().issues.fetchIssues({ org, repo, page });
    }
  ),
  onSetCurrentDisplayType: thunkOn(
    actions => actions.setCurrentDisplayType,
    (actions, _, { getStoreActions, getState }) => {
      const { org, repo, issueId } = getState();
      if (issueId) {
        getStoreActions().issues.fetchIssue({ org, repo, issueId });
      }
    }
  )
};

export default issuesDisplaySlice;
