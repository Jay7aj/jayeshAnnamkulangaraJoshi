import {authService} from './auth.services.js';

const service = authService();

export async function register(req, res, next){
    try{
        const {name, email, password} = req.body;

        const data = await service.registerUser({
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

        const data = await service.loginUser({
            email,
            password
        });

    res.json(data);

    }catch(err){
        next(err);
    }
}