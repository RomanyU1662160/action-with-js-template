const core = require('@actions/core')
const github = require('@actions/github')
const { wait } = require('./wait')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const ms = core.getInput('milliseconds', { required: true })
    const token = core.getInput('token')
    const title = core.getInput('title')
    const body = core.getInput('body')
    const assignees = core.getInput('assignees')
    const octokit = github.getOctokit(token)
    const context = github.context

    const newIssue = await octokit.rest.issues.create({
      ...context.repo,
      title,
      body,
      assignees: assignees ? assignees.split(',') : undefined,
      labels: [':strawberry:']
    })

    console.log('newIssue:::>>>', newIssue)

    // `wait` is a utility function that waits for the specified number of milliseconds
    await wait(parseInt(ms, 10))

    // Set outputs for other workflow steps to use
    const issue = newIssue.data
    core.setOutput('issue', JSON.stringify(issue, null, 2))
    core.setOutput('issue_number', newIssue.data.number)
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
