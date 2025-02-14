
import type { Reporter } from 'knip'
import { IssueRecords } from 'knip/dist/types/issues'

// https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#setting-a-warning-message
export const ISSUE_TYPE_TITLE: Record<string, string> = {
  files: 'Unused files',
  _files: 'Unused files',
  dependencies: 'Unused dependencies',
  devDependencies: 'Unused devDependencies',
  optionalPeerDependencies: 'Referenced optional peerDependencies',
  unlisted: 'Unlisted dependencies',
  binaries: 'Unlisted binaries',
  unresolved: 'Unresolved imports',
  exports: 'Unused exports',
  nsExports: 'Exports in used namespace',
  types: 'Unused exported types',
  nsTypes: 'Exported types in used namespace',
  enumMembers: 'Unused exported enum members',
  classMembers: 'Unused exported class members',
  duplicates: 'Duplicate exports',
}

const parseFileIssue = (value: Set<string>) => {
  const message = ISSUE_TYPE_TITLE["files"]
  return Array.from(value.values()).map(file => {
    return `::warning file=${file},title=${message}`
  })
}
const parseIssueRecords = (type: string, value: IssueRecords) => {
  const message = ISSUE_TYPE_TITLE[type]
  return Object.entries(value).map(([file, v]) => {
    return Object.entries(v).map(([target, value]) => {
      if (value.symbols) {
        return value.symbols.map(symbol => {
          return `::warning file=${file},title=${message},line=${symbol.line},col=${symbol.col}::${symbol.symbol}`
        })
      }
      if (value.col) {
        return `::warning file=${file},title=${message},line=${value.line},col=${value.col}::${target}`
      }
    })
    // console.log(message, { k, v })
    // return `::warning file=${file},title=${message}`
  })
}

const reporter: Reporter = function (options) {

  console.log(options.issues.files)
  const record = Object.entries(options.issues).map(([key, value]) => {
    switch (key) {
      case "files":
        return parseFileIssue(value as Set<string>)
      default:
        return parseIssueRecords(key, value as IssueRecords)
    }
    // console.log({ key, value })
  }).flat(10).filter(record => record && record?.length > 0)

  console.log(record.join("\n"))
  // options.issues.files

  // console.log(options.counters)
}

export default reporter


// const { Reporter } = require('knip')

// const reporter = function (options) {
//   console.log(options.issues)
//   console.log(options.counters)
// }

// exports.modules = reporter

// const input = JSON.parse(process.argv[2])

// const summary = input.issues?.map(issue => {
//   const {} = issue
//   return `::warning file=${issue.file},line=${issue.line},col=${issue.column}::${issue.message}`
//   console.log(JSON.stringify(issue, null, 2))
// })