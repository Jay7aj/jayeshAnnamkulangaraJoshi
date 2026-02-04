export function canViewIssue(user, issue) {
    // For now, everyone who is authenticated can view
    return true;
}

export function canCreateIssue(user) {
    // Any authenticated user
    return !!user;
}

export function canUpdateIssue(user, issue) {
    if (!user || !issue) return false;

    // Admin override
    if (user.role === 'ADMIN') return true;

    // Creator can update
    if (issue.created_by === user.id) return true;

    // Assignee can update (optional but realistic)
    if (issue.assigned_to === user.id) return true;

    return false;
}

export function canDeleteIssue(user, issue) {
    if (!user || !issue) return false;

    // Admin only OR creator
    if (user.role === 'ADMIN') return true;

    if (issue.created_by === user.id) return true;

    return false;
}
