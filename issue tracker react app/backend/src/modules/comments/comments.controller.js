import * as commentsService from './comments.service.js';

export async function create(req, res, next) {
    try {
        const { issueId } = req.params;
        const { content } = req.body;

        const comment = await commentsService.createComment({
            issueId,
            authorId: req.user.id,
            content
        });

        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
}

export async function list(req, res, next) {
    try {
        const { issueId } = req.params;
        const {page, limit} = req.query;
        const comments = await commentsService.getCommentsByIssue(issueId, {
            page: Number(page) || 1,
            limit: Number(limit) || 20
        });

        res.json(comments);
    } catch (err) {
        next(err);
    }
}

export async function remove(req, res, next) {
    try {
        const { commentId } = req.params;
        await commentsService.deleteComment(commentId, req.user);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
