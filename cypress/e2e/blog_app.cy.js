describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'testi',
      username: 'testi',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.visit('')
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
  })
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('testi')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()
      cy.contains('testi logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('testi')
      cy.get('#password').type('eipäollu')
      cy.get('#login-button').click()

      cy.contains('Wrong username or password!')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.login({ username: 'testi', password: 'salasana' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Another One Bites the Dust')
      cy.get('#author').type('Queen')
      cy.get('#url').type('GreatWebsite.com')
      cy.get('#save').click()
      cy.contains('Another One Bites the Dust')
    })
    describe('and blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'one bLog', author: 'MasaMasa', url: 'Mattimeika' })
        cy.createBlog({ title: 'second bLog', author: 'MasaMasa', url: 'markku' })
        cy.createBlog({ title: 'third bLog', author: 'winner', url: 'dasdada' })
      })
      it('A blog can be liked', function() {
        cy.contains('one bLog')
        cy.get('#view-button').click()
        cy.contains('0')
        cy.contains('like').click()
        cy.contains('1')
      })
      it('User owning the blog can delete it', function() {
        cy.contains('one bLog')
        cy.get('#view-button').click()
        cy.contains('delete').click()
        cy.on('window:confirm', () => true)
        cy.contains('was succesfully deleted')
      })
      it('User owning the blog sees delete button', function() {
        cy.contains('one bLog')
        cy.get('#view-button').click()
        cy.contains('delete')
      })
      it('Blog sort works correctly', function() {
        cy.get('.blog').eq(0).should('contain', 'one bLog')
        cy.get('.blog').eq(2).should('contain', 'third bLog')
        cy.contains('third bLog').parent().parent().as('toLike')
        cy.get('@toLike').contains('view').click()
        cy.get('@toLike').contains('like').as('likeit')
        cy.get('@likeit').click()
        cy.get('@likeit').click()
        cy.get('.blog').eq(0).should('contain', 'third bLog')
      })
    })
  })
})