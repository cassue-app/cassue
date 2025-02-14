
import type { Reporter } from 'knip'

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
    return `::warning file=${file}::${message}`
  }).join("\n")

}
const reporter: Reporter = function (options) {

  const record = Object.entries(options.issues).map(([key, value]) => {
    switch (key) {
      case "files":
        return parseFileIssue(value as Set<string>)
    }
    // console.log({ key, value })
  })
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