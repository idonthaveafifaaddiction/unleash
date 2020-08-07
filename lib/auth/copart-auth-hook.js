/* eslint-disable import/no-extraneous-dependencies */

'use strict';

/**
 * Copart OAuth 2.0
 *
 * You should read Using OAuth 2.0 to Access Google APIs:
 * https://developers.google.com/identity/protocols/OAuth2
 *
 * This example assumes that all users authenticating via
 * copart employee auth should have access. You would probably limit access
 * to users you trust.
 *
 * The implementation assumes the following environment variables:
 *  -EMPLOYEE_AUTH_TOKEN_URI
 *  -EMPLOYEE_AUTH_CLIENT_ID
 *  -EMPLOYEE_AUTH_CLIENT_SECRET
 */

const passport = require('@passport-next/passport');
const LocalStrategy = require('@passport-next/passport-local').Strategy;
const BodyParser = require('body-parser');
const request = require('request');
const { User, AuthenticationRequired } = require('../server-impl.js');

function copartAuthenticate(username, password) {
    return new Promise(function(resolve, reject) {
        const options = {
            method: 'POST',
            url: process.env.EMPLOYEE_AUTH_TOKEN_URI,
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${process.env.EMPLOYEE_AUTH_CLIENT_ID}:${process.env.EMPLOYEE_AUTH_CLIENT_SECRET}`,
                ).toString('base64')}`,
            },
            formData: {
                grant_type: 'password',
                username,
                password,
            },
        };
        request(options, function(error, response) {
            if (error) throw new Error(error);
            if (response.statusCode === 200) {
                resolve(response.body);
            } else {
                reject(response.body);
            }
        });
    });
}

passport.use(
    new LocalStrategy(function(username, password, done) {
        copartAuthenticate(username, password)
            .then(data => {
                const jsonData = JSON.parse(data);
                return done(
                    null,
                    new User({
                        name: jsonData.entity_name,
                        email: jsonData.entity_mail,
                    }),
                );
            })
            .catch(err => {
                console.error(err);
                return done(null, false);
            });
    }),
);

function enableCopartOauth(app) {
    if (!process.env.EMPLOYEE_AUTH_TOKEN_URI) {
        console.error(
            'Copart Employee auth token uri not defined, required EMPLOYEE_AUTH_TOKEN_URI',
        );
        throw new Error(
            `Copart Employee auth token uri not defined, required EMPLOYEE_AUTH_TOKEN_URI`,
        );
    }
    if (!process.env.EMPLOYEE_AUTH_CLIENT_ID) {
        console.error(
            'Copart Employee auth client id not defined, required EMPLOYEE_AUTH_CLIENT_ID',
        );
        throw new Error(
            `Copart Employee auth client id not defined, required EMPLOYEE_AUTH_CLIENT_ID`,
        );
    }
    if (!process.env.EMPLOYEE_AUTH_CLIENT_SECRET) {
        console.error(
            'Copart Employee auth client secret not defined, required EMPLOYEE_AUTH_CLIENT_SECRET',
        );
        throw new Error(
            `Copart Employee auth client secret not defined, required EMPLOYEE_AUTH_CLIENT_SECRET`,
        );
    }
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(BodyParser.urlencoded({ extended: true }));
    app.set('views', `${__dirname}/views`);
    app.set('view engine', 'ejs');
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
    // app.get('/login', passport.authenticate('local', { scope: ['email'] }));
    app.get('/login', function(req, res) {
        res.render('login');
    });
    app.post(
        '/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        },
    );

    app.get(
        '/api/auth/callback',
        passport.authenticate('local', {
            failureRedirect: '/api/admin/error-login',
        }),
        (req, res) => {
            // Successful authentication, redirect to your app.
            res.redirect('/');
        },
    );

    app.use('/api/admin/', (req, res, next) => {
        if (req.user) {
            return next();
        }
        // Instruct unleash-frontend to pop-up auth dialog
        return res
            .status('401')
            .json(
                new AuthenticationRequired({
                    path: '/login',
                    type: 'custom',
                    message: `You have to identify yourself in order to use Unleash.
                        Click the button and follow the instructions.`,
                }),
            )
            .end();
    });
}

module.exports = enableCopartOauth;
