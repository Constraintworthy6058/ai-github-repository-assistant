export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string; avatar_url: string };
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  updated_at: string;
  permissions?: { admin: boolean; push: boolean; pull: boolean };
};

export type GitHubContent = {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file" | "dir" | "symlink" | "submodule";
  html_url: string | null;
  download_url: string | null;
  content?: string;
  encoding?: string;
};

export type GitHubCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string; email: string; date: string } | null;
  };
  author: { login: string; avatar_url: string } | null;
  files?: Array<{ filename: string; status: string; additions: number; deletions: number; changes: number; patch?: string }>;
};

export type GitHubPull = {
  number: number;
  title: string;
  html_url: string;
  state: string;
  draft: boolean;
  user: { login: string; avatar_url: string } | null;
  created_at: string;
  updated_at: string;
  changed_files?: number;
  additions?: number;
  deletions?: number;
  body: string | null;
};

export type GitHubIssue = {
  number: number;
  title: string;
  html_url: string;
  state: string;
  user: { login: string; avatar_url: string } | null;
  labels: Array<{ name: string; color: string }>;
  created_at: string;
  updated_at: string;
  comments: number;
  body: string | null;
  pull_request?: unknown;
};

export type CodeSearchItem = {
  name: string;
  path: string;
  html_url: string;
  repository: { full_name: string };
  text_matches?: Array<{ fragment: string; matches: Array<{ text: string; indices: number[] }> }>;
};
