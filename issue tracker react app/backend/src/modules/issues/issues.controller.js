import {createIssueSchema, updateIssueSchema} from './issues.validation.js';
import { listIssuesQuerySchema } from './issues.query.schema.js';
import { issueIdParamSchema } from './issues.param.schema.js';
import { NotFoundError, ForbiddenError } from '../../utils/apiError.js';
import { canUpdateIssue, canDeleteIssue } from '../../policies/issue.policy.js';
import { issuesService } from './issues.services.js';

const service = issuesService();

export async function create(req, res, next){
    try{
        const data = createIssueSchema.parse(req.body);
        const issue = await service.createIssue({
            ...data,
            createdBy: req.user.id
        });

        res.status(201).json({data: issue});
    }catch(err){
        next(err);
    }
}

export async function list(req, res, next){
    try{
        const query = listIssuesQuerySchema.parse(req.query);
        const issues = await service.getAllIssues(query);
        res.json(issues);
    }catch(err){
        next(err);
    }
}

export async function get(req, res, next){
    try{
        const {id}= issueIdParamSchema.parse(req.params);
        const issue = await service.getIssueById(id);
        if(!issue) throw new NotFoundError('Issue not found');
        res.json({data: issue});
    }catch(err){
        next(err);
    }
}

export async function update(req, res, next){
    try{
        const {id}= issueIdParamSchema.parse(req.params);

        const issue = await service.getIssueById(id);
        if(!issue){
            throw new NotFoundError('Issue not found');
        }

        if(!canUpdateIssue(req.user, issue)){
            throw new ForbiddenError();
        }
        const updates = updateIssueSchema.parse(req.body);
        const updated = await service.updateIssue(id, updates);
        res.json({data: updated});

    }catch(err){
        next(err);
    }
}

export async function remove(req, res, next){
    try{
        const {id}= issueIdParamSchema.parse(req.params);
        const issue = await service.getIssueById(id);
        if(!issue) throw new NotFoundError('Issue not Found');
        if(!canDeleteIssue(req.user, issue)){
            throw new ForbiddenError();
        }
        await service.deleteIssue(id);
        res.status(204).send();
    }catch(err){
        next(err);
    }
}


