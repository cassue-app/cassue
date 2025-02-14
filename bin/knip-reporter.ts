
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
  const title = `[knip] ${ISSUE_TYPE_TITLE[type]}`
  const values = Object.entries(value).map(([file, v]) => {
    return Object.entries(v).map(([target, value]) => {
      return { file, target, value }
    })
  }).flat(1)

  const warnings = values.map(({ file, target, value }) => {
    if (value.symbols) {
      return value.symbols.map(symbol => {
        return `::warning file=${file},title=${title},line=${symbol.line},col=${symbol.col}::${target}/${symbol.symbol}`
      })
    }
    return `::warning file=${file},title=${title},line=${value.line},col=${value.col}::${target}/${value.symbol}`
  }).flat(1)
  return warnings
}

const reporter: Reporter = function (options) {
  const { files, _files, ...records } = options.issues
  const fileWarnings = parseFileIssue(files)
  const recordWarnings = Object.entries(records).map(([key, value]) => {
    return parseIssueRecords(key, value as IssueRecords)
  }).flat(1)
  const warnings = [...fileWarnings, ...recordWarnings]
    .filter(warn => (warn && warn?.length > 0))

  console.log(warnings.join("\n"))
}

export default reporter
