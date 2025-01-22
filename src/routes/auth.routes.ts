import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validateAuth } from '../middleware/validation.middleware';

const router = Router();

router.post('/register', validateAuth, register); // router.post() -> defines a route
router.post('/login', validateAuth, login); // to handle POST HTTP requests

/* 
These two lines define POST routes for /register and /login. Here's a breakdown:

    /register and /login are the URL paths that the server listens for POST requests on.

    validateAuth is a middleware function that validates the request before allowing the route handler to execute.

    register and login are the controller functions that will be called when the route is matched 
    (i.e., when a POST request is made to /register or /login). 

*/

export default router;