import * as authService from './auth.service.js';

export async function register(req, res, next){
    try{
        const {name, email, password} = req.body;

        const data = await authService.registerUser({
            name,
            email,
            password
        });

        res.status(201).json(data);
    }catch (err){
        next(err);
    }
}

export async function login(req, res, next){
    try{
        const {email, password} = req.body;

        const data = await authService.loginUser({
            email,
            password
    });

    res.json(data);

    }catch(err){
        next(err);
    }
}