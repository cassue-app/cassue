import { Octokit } from "octokit"
import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types"
import { RepositoryQuery, IssuePostParam, IssuesTargetQuery, IssueCommentQuery } from "./Schema"


const octokit = new Octokit()

// TODO

type IssueResponsees = GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.issues.listForRepo>
export type IssueResponse = IssueResponsees[number]

type IssueCommentResponsees = GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.issues.listComments>
export type IssueComementResponse = IssueCommentResponsees[number]

const issueState = ["all", "closed", "open"] as const

const resolveIssueListFilter = (filter: string[] = []) => {
  const [type, value] = filter
  switch (type) {
    case "labels":
      return { labels: value }
    case "issues":
      // @ts-ignore
      if (issueState.includes(value)) {
        return {
          state: value as (typeof issueState)[number]
        }
      }
      return {}
  }
  return {}
}


export type LabelResponse = GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.issues.listLabelsForRepo>

export class GithubClient {
  client: Octokit
  account: Record<string, string>
  constructor(account: Record<string, string>) {
    this.account = account
    this.client = new Octokit({
      auth: this.account.access_token,
    })

  }


  async getAllIssue(param: IssuesTargetQuery): Promise<IssueResponsees> {
    const { filter, ...repoParam } = param
    const filterQuery = resolveIssueListFilter(filter ?? [])
    const result = await this.client.rest.issues.listForRepo({
      ...repoParam,
      ...filterQuery,
      direction: "desc"
    }) //.issues.list(param)
    return result.data
  }

  async postIssue(target: RepositoryQuery, param: IssuePostParam) {
    const result = await this.client.rest.issues.create({
      ...target,
      ...param,
    }) //.issues.list(param)
    return result.data
  }

  async getComments(param: IssueCommentQuery) {
    const { number, ...rest } = param
    const result = await this.client.rest.issues.listComments({
      ...rest,
      issue_number: number
    })
    return result.data
  }

  async getCustomLabels(param: RepositoryQuery) {
    const result = await this.client.rest.issues.listLabelsForRepo({
      ...param,
    })

    return result.data.filter(label => {
      return label.default === false
    })
  }

}
