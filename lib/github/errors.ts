export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly rateLimitRemaining?: string | null,
    public readonly rateLimitReset?: string | null,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

export function githubErrorMessage(error: unknown) {
  if (!(error instanceof GitHubApiError)) return "GitHub could not be reached. Please try again.";
  if (error.status === 401) return "Your GitHub session has expired. Sign in again.";
  if (error.status === 403 && error.rateLimitRemaining === "0") return "GitHub API rate limit reached. Please try again after the reset time.";
  if (error.status === 403) return "You do not have permission to access this repository.";
  if (error.status === 404) return "The repository or resource was not found.";
  return error.message;
}
