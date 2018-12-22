const wkdir       = process.cwd()
const env         = process.env.PRODUCTION ? 'dist' : 'dev'
const path        = require('path')
const UserModel   = require('./mongo/models/User')
const password    = require('password-hash-and-salt')

console.info('Env is set as', env)

module.exports = (express, app, passport) => {

    app.get('/', (req, res) => {
        console.log('req.user', req.user)
        if(req.user && req.user.newUser) {
            console.log('rendering edit page...')
            return res.render('user-edit')
        } else if(req.user) {
            console.log('serving app...')
            res.sendFile(path.resolve(wkdir, 'build', env, 'index.html'))
            app.use(express.static(path.resolve(wkdir, 'build', env)))
        } else {
            console.log('/ redirecting to login')
            res.redirect('/login')
        }
    })

    app.get('/login', (req, res) => {
        res.render('login')
    })

    app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })

    app.get('/whoami', (req, res) => {
        if(req.user) {
            const { displayName, id, adult } = req.user
            res.status(200).send({ displayName, id, adult })
        } else {
            res.status(404).send({ message: 'User not found' })
        }
    })

    app.post('/login', (req, res, next) => {
        console.log('Attempting login')
        passport.authenticate(
            'local',
            { failureRedirect: '/login' },
            (err, user, info) => {
                //user is returned from passport.js
                if (err) return next(err)

                if (!user) {
                    const validationError = info && info.error
                    console.log('validation error ', validationError)
                    return res.render('login', { validationError })
                }
                req.logIn(user, function (err) {
                    if (err) return next(err)
                    console.log('user logged in successfully')
                    return res.redirect('/')
                })
            }
        )(req, res, next)
    })

    app.post('/newUserEdit', async (req, res) => {
        const { user } = req
        if(!user) res.redirect('/')
        const message = validateForm(user, req.body)
        if(Object.keys(message).length) {
            res.render('user-edit', { ...message })
        }
        const updateData = {}
        if(req.body.displayName) {
            updateData['displayName'] = req.body.displayName
        }
        if(req.body.password1) {
            updateData['password'] = await hash(req.body.password1)
        }

        updateModel(user.id, updateData)
            .then(() => res.redirect('/'))
            .catch(err => console.error(err))
    })
}

function validateForm(user, form) {
    const message = {}
    if(user.newUser && !form.displayName) {
        message['displayNameError'] = 'Please enter a display name.'
    }
    if(user.newUser && (!form.password1 || !form.password2)) {
        message['passwordError'] = 'Please choose a new password.'
    }
    if(form.password1 !== form.password2) {
        message['passwordError'] = 'Passwords don\'t match.'
    }
    return message
}

function updateModel(id, updateData) {
    updateData.newUser = false
    return new Promise((resolve, reject) => {
        UserModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            err => {
                if(err) reject(err)
                resolve()
            }
        );
    })
}

function hash(pword) {
    return new Promise((resolve, reject) => {
        password(pword).hash((err, hash) => {
            if(err) console.error(err)
            resolve(hash)
        })
    })
}