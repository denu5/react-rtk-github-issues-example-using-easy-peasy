import { Action, action, Thunk, thunk } from 'easy-peasy';
import { StoreModel } from 'model';
import { Injections } from 'store';
import { Issue, Comment } from 'services/github-service';

interface CommentsState {
  commentsByIssue: Record<number, Comment[] | undefined>;
  loading: boolean;
  error: string | null;
}

interface CommentLoaded {
  issueId: number;
  comments: Comment[];
}

export interface CommentsModel extends CommentsState {
  getCommentsStart: Action<CommentsModel>;
  getCommentsSuccess: Action<CommentsModel, CommentLoaded>;
  getCommentsFailure: Action<CommentsModel, string>;
  fetchComments: Thunk<CommentsModel, Issue, Injections, StoreModel>;
}

const initialState: CommentsState = {
  commentsByIssue: {},
  loading: false,
  error: null
};

const commentsModel: CommentsModel = {
  ...initialState,
  getCommentsStart: action(state => {
    state.loading = true;
    state.error = null;
  }),
  getCommentsSuccess: action((state, payload) => {
    const { comments, issueId } = payload;
    state.commentsByIssue[issueId] = comments;
    state.loading = false;
    state.error = null;
  }),
  getCommentsFailure: action((state, payload) => {
    state.loading = false;
    state.error = payload;
  }),
  fetchComments: thunk(async (actions, payload, { injections }) => {
    const issue = payload;
    const { githubService } = injections;
    try {
      actions.getCommentsStart();
      const comments = await githubService.getComments(issue.comments_url);
      actions.getCommentsSuccess({ issueId: issue.number, comments });
    } catch (err) {
      actions.getCommentsFailure(err.toString());
    }
  })
};

export default commentsModel;
