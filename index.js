/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')

  app.on('issues.opened', async context => {
    app.log('Event received, issue opened')
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
    return context.github.issues.createComment(issueComment)
  })


  app.on('issue_comment.created', async context => {
    app.log('Event received, new issue comment')
    // Create a comment only if the person posting is not kwas-first-app
    if (context.payload['sender']['id'] != 55536229) {
      const issueComment = context.issue({ body: 'Thank you for commenting!' })
      return context.github.issues.createComment(issueComment)
    }
  })
  
  // HTTP Routes, for exposing end-points - for example: we need this to be able to ask the app to add or remove users
  // Get an express router to expose new HTTP endpoints
  const router = app.route('/my-app')

  // Use any middleware
  router.use(require('express').static('public'))

  // Add a new route
  router.get('/hello-world', (req, res) => {
    res.send('Hello World')
  })

  

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
