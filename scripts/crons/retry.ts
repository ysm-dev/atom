import { differenceInMilliseconds } from 'date-fns'
import ms from 'ms'
import { env } from 'utils/secrets'

const retry = async () => {
  const PAT_1 = env().GITHUB_PAT_1
  const PAT = env().GITHUB_PAT

  const { workflow_runs } = await fetch(
    'https://api.github.com/repos/ysm-dev/atom/actions/runs',
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${PAT_1}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  ).then<Res>((r) => r.json())

  const latestSendWorkflow = workflow_runs.filter(
    (v) => v.path === '.github/workflows/send.yml',
  )[0]

  if (
    differenceInMilliseconds(
      new Date(),
      new Date(latestSendWorkflow.created_at),
    ) < ms('10m')
  ) {
    return
  }

  await Promise.all([
    fetch(`https://api.github.com/repos/ysm-dev/atom/dispatches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${PAT}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'insomnia/8.4.5',
      },
      body: JSON.stringify({
        event_type: 'update',
      }),
    }),
  ])
}

retry()

export interface Res {
  total_count: number
  workflow_runs: WorkflowRun[]
}

export interface WorkflowRun {
  id: number
  name: WorkflowRunName
  node_id: string
  head_branch: HeadBranch
  head_sha: string
  path: string
  display_title: DisplayTitle
  run_number: number
  event: Event
  status: Status
  conclusion: Conclusion | null
  workflow_id: number
  check_suite_id: number
  check_suite_node_id: string
  url: string
  html_url: string
  pull_requests: any[]
  created_at: Date
  updated_at: Date
  actor: Actor
  run_attempt: number
  referenced_workflows: any[]
  run_started_at: Date
  triggering_actor: Actor
  jobs_url: string
  logs_url: string
  check_suite_url: string
  artifacts_url: string
  cancel_url: string
  rerun_url: string
  previous_attempt_url: null
  workflow_url: string
  head_commit: HeadCommit
  repository: Repository
  head_repository: Repository
}

export interface Actor {
  login: Login
  id: number
  node_id: ActorNodeID
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: FollowingURL
  gists_url: GistsURL
  starred_url: StarredURL
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: EventsURL
  received_events_url: string
  type: Type
  site_admin: boolean
}

export enum EventsURL {
  HTTPSAPIGithubCOMUsersYsmDevEventsPrivacy = 'https://api.github.com/users/ysm-dev/events{/privacy}',
}

export enum FollowingURL {
  HTTPSAPIGithubCOMUsersYsmDevFollowingOtherUser = 'https://api.github.com/users/ysm-dev/following{/other_user}',
}

export enum GistsURL {
  HTTPSAPIGithubCOMUsersYsmDevGistsGistID = 'https://api.github.com/users/ysm-dev/gists{/gist_id}',
}

export enum Login {
  YsmDev = 'ysm-dev',
}

export enum ActorNodeID {
  MDQ6VXNlcjE4NDg3MjQx = 'MDQ6VXNlcjE4NDg3MjQx',
}

export enum StarredURL {
  HTTPSAPIGithubCOMUsersYsmDevStarredOwnerRepo = 'https://api.github.com/users/ysm-dev/starred{/owner}{/repo}',
}

export enum Type {
  User = 'User',
}

export enum Conclusion {
  Success = 'success',
}

export enum DisplayTitle {
  Send = 'Send',
  Update = 'update',
}

export enum Event {
  RepositoryDispatch = 'repository_dispatch',
  WorkflowRun = 'workflow_run',
}

export enum HeadBranch {
  Main = 'main',
}

export interface HeadCommit {
  id: string
  tree_id: string
  message: Message
  timestamp: Date
  author: Author
  committer: Author
}

export interface Author {
  name: AuthorName
  email: Email
}

export enum Email {
  ActionsGithubCOM = 'actions@github.com',
  The41898282GithubActionsBotUsersNoreplyGithubCOM = '41898282+github-actions[bot]@users.noreply.github.com',
}

export enum AuthorName {
  ActionsBot = 'Actions Bot',
  GithubActionsBot = 'github-actions[bot]',
}

export enum Message {
  ApplyAutomaticChanges = 'Apply automatic changes',
}

export interface Repository {
  id: number
  node_id: HeadRepositoryNodeID
  name: HeadRepositoryName
  full_name: FullName
  private: boolean
  owner: Actor
  html_url: string
  description: null
  fork: boolean
  url: string
  forks_url: string
  keys_url: KeysURL
  collaborators_url: string
  teams_url: string
  hooks_url: string
  issue_events_url: IssueEventsURL
  events_url: string
  assignees_url: AssigneesURL
  branches_url: BranchesURL
  tags_url: string
  blobs_url: BlobsURL
  git_tags_url: GitTagsURL
  git_refs_url: GitRefsURL
  trees_url: TreesURL
  statuses_url: StatusesURL
  languages_url: string
  stargazers_url: string
  contributors_url: string
  subscribers_url: string
  subscription_url: string
  commits_url: CommitsURL
  git_commits_url: GitCommitsURL
  comments_url: CommentsURL
  issue_comment_url: string
  contents_url: ContentsURL
  compare_url: string
  merges_url: string
  archive_url: ArchiveURL
  downloads_url: string
  issues_url: IssuesURL
  pulls_url: PullsURL
  milestones_url: MilestonesURL
  notifications_url: string
  labels_url: LabelsURL
  releases_url: ReleasesURL
  deployments_url: string
}

export enum ArchiveURL {
  HTTPSAPIGithubCOMReposYsmDevAtomArchiveFormatRef = 'https://api.github.com/repos/ysm-dev/atom/{archive_format}{/ref}',
}

export enum AssigneesURL {
  HTTPSAPIGithubCOMReposYsmDevAtomAssigneesUser = 'https://api.github.com/repos/ysm-dev/atom/assignees{/user}',
}

export enum BlobsURL {
  HTTPSAPIGithubCOMReposYsmDevAtomGitBlobsSHA = 'https://api.github.com/repos/ysm-dev/atom/git/blobs{/sha}',
}

export enum BranchesURL {
  HTTPSAPIGithubCOMReposYsmDevAtomBranchesBranch = 'https://api.github.com/repos/ysm-dev/atom/branches{/branch}',
}

export enum CommentsURL {
  HTTPSAPIGithubCOMReposYsmDevAtomCommentsNumber = 'https://api.github.com/repos/ysm-dev/atom/comments{/number}',
}

export enum CommitsURL {
  HTTPSAPIGithubCOMReposYsmDevAtomCommitsSHA = 'https://api.github.com/repos/ysm-dev/atom/commits{/sha}',
}

export enum ContentsURL {
  HTTPSAPIGithubCOMReposYsmDevAtomContentsPath = 'https://api.github.com/repos/ysm-dev/atom/contents/{+path}',
}

export enum FullName {
  YsmDevAtom = 'ysm-dev/atom',
}

export enum GitCommitsURL {
  HTTPSAPIGithubCOMReposYsmDevAtomGitCommitsSHA = 'https://api.github.com/repos/ysm-dev/atom/git/commits{/sha}',
}

export enum GitRefsURL {
  HTTPSAPIGithubCOMReposYsmDevAtomGitRefsSHA = 'https://api.github.com/repos/ysm-dev/atom/git/refs{/sha}',
}

export enum GitTagsURL {
  HTTPSAPIGithubCOMReposYsmDevAtomGitTagsSHA = 'https://api.github.com/repos/ysm-dev/atom/git/tags{/sha}',
}

export enum IssueEventsURL {
  HTTPSAPIGithubCOMReposYsmDevAtomIssuesEventsNumber = 'https://api.github.com/repos/ysm-dev/atom/issues/events{/number}',
}

export enum IssuesURL {
  HTTPSAPIGithubCOMReposYsmDevAtomIssuesNumber = 'https://api.github.com/repos/ysm-dev/atom/issues{/number}',
}

export enum KeysURL {
  HTTPSAPIGithubCOMReposYsmDevAtomKeysKeyID = 'https://api.github.com/repos/ysm-dev/atom/keys{/key_id}',
}

export enum LabelsURL {
  HTTPSAPIGithubCOMReposYsmDevAtomLabelsName = 'https://api.github.com/repos/ysm-dev/atom/labels{/name}',
}

export enum MilestonesURL {
  HTTPSAPIGithubCOMReposYsmDevAtomMilestonesNumber = 'https://api.github.com/repos/ysm-dev/atom/milestones{/number}',
}

export enum HeadRepositoryName {
  Atom = 'atom',
}

export enum HeadRepositoryNodeID {
  RKgDOK7EE1Q = 'R_kgDOK7eE1Q',
}

export enum PullsURL {
  HTTPSAPIGithubCOMReposYsmDevAtomPullsNumber = 'https://api.github.com/repos/ysm-dev/atom/pulls{/number}',
}

export enum ReleasesURL {
  HTTPSAPIGithubCOMReposYsmDevAtomReleasesID = 'https://api.github.com/repos/ysm-dev/atom/releases{/id}',
}

export enum StatusesURL {
  HTTPSAPIGithubCOMReposYsmDevAtomStatusesSHA = 'https://api.github.com/repos/ysm-dev/atom/statuses/{sha}',
}

export enum TreesURL {
  HTTPSAPIGithubCOMReposYsmDevAtomGitTreesSHA = 'https://api.github.com/repos/ysm-dev/atom/git/trees{/sha}',
}

export enum WorkflowRunName {
  Job = 'Job',
  Send = 'Send',
}

export enum Status {
  Completed = 'completed',
  InProgress = 'in_progress',
}
