// backend/src/modules/issues/issues.controller.js

import { issuesService } from './issues.services.js';
import {
  createIssueSchema,
  updateIssueSchema
} from './issues.validation.js';
import { NotFoundError, ForbiddenError } from '../../utils/apiError.js';
import { canUpdateIssue, canDeleteIssue } from '../../policies/issue.policy.js';

export function createIssuesController({ db }) {
  const service = issuesService(db);

  return {
    async create(req, res, next) {

      try {

        const data = createIssueSchema.parse(req.body);
        const issue = await service.createIssue({
          ...data,
          createdBy: req.user.id
        });
        res.status(201).json({ data: issue });
      } catch (err) {
        next(err);
      }
    },

    async list(req, res, next) {
      try {
        const issues = await service.getAllIssues(req.query);
        res.json(issues);
      } catch (err) {
        next(err);
      }
    },

    async get(req, res, next) {
      try {
        const issue = await service.getIssueById(req.params.id);
        if (!issue) throw new NotFoundError('Issue not found');
        res.json({ data: issue });
      } catch (err) {
        next(err);
      }
    },

    async update(req, res, next) {
      try {
        const issue = await service.getIssueById(req.params.id);
        if (!issue) throw new NotFoundError();

        if (!canUpdateIssue(req.user, issue)) {
          throw new ForbiddenError();
        }

        const updates = updateIssueSchema.parse(req.body);
        const updated = await service.updateIssue(req.params.id, updates, req.user);
        res.json({ data: updated });
      } catch (err) {
        next(err);
      }
    },

    async remove(req, res, next) {
      try {
        const issue = await service.getIssueById(req.params.id);
        if (!issue) throw new NotFoundError();

        if (!canDeleteIssue(req.user, issue)) {
          throw new ForbiddenError();
        }

        await service.deleteIssue(req.params.id, req.user);
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    }
  };
}
