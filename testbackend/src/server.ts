
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import * as JWT from 'jsonwebtoken';
import * as _ from "lodash";
import * as path from 'path';
import { ErrorHandler } from './modules/base/conf/error-handler';
import { GLOBALS } from './modules/base/conf/globals';
import { BaseRoute } from './modules/base/routes/base.routes';

export class Server {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.setConfiguration();
        this.navigateToRoutes();
    }

    securityCheck(req: express.Request, res: express.Response, next: express.NextFunction) {

        const isPublic = _.find(GLOBALS.PUBLIC_URLS, (element) => {
            if (element == req.originalUrl) {
                return true;
            } else if (element == req.originalUrl.substr(0, req.originalUrl.lastIndexOf('/'))) {
                return true;
            }
        })

        if (isPublic) {
            next();
        } else {
            // check header or url parameters or post parameters for token
            const token = req.headers['token'] as string;
            // decode token
            if (token) {
                JWT.verify(token, GLOBALS.SECRET, function (err, decoded) {
                    if (err) {
                        return res.json({
                            error: true,
                            message: 'Failed to authenticate token.'
                        });
                    } else {
                        let identity = { userId: decoded['id'], role: decoded['role'] }
                        if (req['session']) {
                            req['session']['identity'] = identity;
                        }
                        next();

                        // this.checkRole(req, decoded);
                    }
                });
            } else {
                // if there is no token
                return ErrorHandler.sendAuthorizationError(ErrorHandler.invalidToken, res, next);
            }
        }
    }

    private navigateToRoutes() {
        this.app.use(session({
            saveUninitialized: true,
            resave: true,
            secret: '$#@MEDICSI@ARMAGHAN&^%',
            cookie: { maxAge: 60 * 60 * 24 }
        }));

        let router: express.Router;
        router = express.Router();
        router.use(this.securityCheck);

        new BaseRoute(router);
        this.app.use('/', router);
    }

    private setConfiguration() {
        this.app.use(cors({ origin: '*' }));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(bodyParser.json({ limit: '300mb' }));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser('The_School_App'));
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            var error = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }

}