const nock = require('nock')
// Requiring our app implementation
const myProbotApp = require('..')
const { Probot } = require('probot')
// Requiring our fixtures
const payload = require('./fixtures/issues.labeled')
const payloadComment = require('./fixtures/issue_comment.created')
const issueCreatedBody = { body: 'Thanks for opening this issue!' }
const issueCommentCreatedBody = { body: 'Thank you for commenting!' }

nock.disableNetConnect()

describe('My Probot app', () => {
  let probot

  beforeEach(() => {
    probot = new Probot({})
    // Load our app into probot
    const app = probot.load(myProbotApp)

    // just return a test token
    app.app = () => 'test'
  })

  test('creates a comment when an issue is opened', async () => {
    // Test that we correctly return a test token
    nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, { token: 'test' })

    // Test that a comment is posted
    nock('https://api.github.com')
      .post('/repos/hiimbex/testing-things/issues/1/comments', (body) => {
        expect(body).toMatchObject(issueCreatedBody)
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ name: 'issues', payload })
    console.log('test passed!')
  })
  
  test('create a comment when an issue comment is created by a user that is not kwas-github-app', async () => {
    // Test that we correctly return a test token
    nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, { token: 'test' })

    // Test that a comment is posted
    nock('https://api.github.com')
      .post('/repos/hiimbex/testing-things/issues/1/comments', (body) => {
        expect(body).toMatchObject(issueCommentCreatedBody)
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ name: 'issue_comment', payloadComment })
    console.log('second test passed!')
  })

})

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about testing with Nock see:
// https://github.com/nock/nock
