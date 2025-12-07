import * as github from '@actions/github';
import * as core from '@actions/core';

export interface ContributionStats {
  commits: number;
  prsMerged: number;
  issuesClosed: number;
  streak: number;
}

export class GitHubService {
  private octokit;

  constructor(token: string) {
    this.octokit = github.getOctokit(token);
  }

  async getContributionStats(username: string): Promise<ContributionStats> {
    const now = new Date();
    // Fetch last year to calculate streak
    const from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const fromIso = from.toISOString();

    try {
      const query = `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              totalCommitContributions
              contributionCalendar {
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;

      const { user } = await this.octokit.graphql<{ user: any }>(query, {
        username,
        from: fromIso,
        to: now.toISOString(),
      });

      const collection = user.contributionsCollection;
      const commits = collection.totalCommitContributions;

      // Calculate Streak
      let streak = 0;
      const days = collection.contributionCalendar.weeks
        .flatMap((w: any) => w.contributionDays)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort desc (newest first)

      // Check "today" and "yesterday" to start the streak
      // If no contribs today yet, streak might still be alive from yesterday
      const todayStr = now.toISOString().split('T')[0];
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let streakBroken = false;
      
      for (const day of days) {
        if (day.date > todayStr) continue; // Future days (timezone diffs)

        // If it's today and we have 0, we don't break streak yet, we just look at yesterday
        if (day.date === todayStr && day.contributionCount === 0) {
            continue;
        }

        if (day.contributionCount > 0) {
            streak++;
        } else {
            // If we hit a zero...
            // Use strict streak: if we missed yesterday (and it's not today), break.
            // But we are iterating backwards.
            // If we are at "Today" (and count>0), streak=1.
            // If we are at "Yesterday" (and count=0) -> Break.
            
            // We need to ensure we don't count "gaps"
            streakBroken = true;
            break;
        }
      }

      // 2. Get Merged PRs
      // We assume simple 24h count for PR/Issues to match "Daily Feed" logic
      // But for Streak, we used the Calendar.
      // For "Feeding" (HP/XP gain), we only want *Recent* activity (last 24h).
      // The previous logic used specific search. We can keep that for specific stat gain, 
      // OR we can just use the Calendar's "today" count for commits?
      // The user wants "Fuel". Fuel = Activity SINCE last run.
      // But the "ContributionStats" object is used for both.
      
      // Let's keep the Search Query for explicit 24h PR/Issue counts (as they give XP/Mood).
      // Commits we can get from the calendar "today" if we want, or keep the totalCommitContributions (which is range based).
      // actually totalCommitContributions is for the whole year now because of $from one year ago.
      // We need "Commits in last 24h" for HP.
      // We can iterate the days for that too? Or just run the specific query?
      // Let's iterate the days for "Today"s commits.
      const todayDay = days.find((d: any) => d.date === todayStr);
      const commitsToday = todayDay ? todayDay.contributionCount : 0;

      // For PRs and Issues, we stick to the search for "last 24h" accuracy
      const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const prQuery = `is:pr is:merged author:${username} merged:>=${since24h}`;
      const prs = await this.octokit.rest.search.issuesAndPullRequests({ q: prQuery });

      const issueQuery = `is:issue is:closed author:${username} closed:>=${since24h}`;
      const issues = await this.octokit.rest.search.issuesAndPullRequests({ q: issueQuery });

      core.info(`Fetched stats: Streak=${streak}, Commits(24h)=${commitsToday}, PRs(24h)=${prs.data.total_count}`);

      return {
        commits: commitsToday,
        prsMerged: prs.data.total_count,
        issuesClosed: issues.data.total_count,
        streak: streak
      };

    } catch (error) {
      core.error(`Error fetching stats: ${error}`);
      return { commits: 0, prsMerged: 0, issuesClosed: 0, streak: 0 };
    }
  }
}
