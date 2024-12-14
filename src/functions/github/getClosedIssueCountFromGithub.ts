import { env } from "@/lib/env"
import { ofetch } from "@/lib/ofetch"
import { z } from "zod"

export const getClosedIssueCountFromGithub = async (
  githubRepositoryLink: string,
) => {
  const [repositoryName, organizationName] = githubRepositoryLink
    .split("/")
    .reverse()

  const response = await ofetch<{
    total_count: number
  }>(`https://api.github.com/search/issues`, {
    query: {
      q: `repo:${organizationName}/${repositoryName} is:issue is:closed`,
      page: 1,
      per_page: 1,
    },
    headers: {
      Authorization: `Bearer ${env.GITHUBPAT_TOKEN}`,
    },
  })

  const { total_count } = getClosedIssueCountFromGithubSchema.parse(response)

  return total_count
}

const getClosedIssueCountFromGithubSchema = z.object({
  total_count: z.number(),
})
