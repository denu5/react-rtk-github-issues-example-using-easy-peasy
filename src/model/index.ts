import issuesDisplayModel, { IssuesDisplayModel } from './issuesDisplay';
import issuesModel, { IssuesModel } from './issues';
import commentsModel, { CommentsModel } from './comments';
import repoDetailsModel, { RepoDetailsModel } from './repoDetails';

export interface StoreModel {
  issueDisplay: IssuesDisplayModel;
  issues: IssuesModel;
  comments: CommentsModel;
  repoDetails: RepoDetailsModel;
}

const storeModel: StoreModel = {
  issueDisplay: issuesDisplayModel,
  issues: issuesModel,
  comments: commentsModel,
  repoDetails: repoDetailsModel
};

export default storeModel;
