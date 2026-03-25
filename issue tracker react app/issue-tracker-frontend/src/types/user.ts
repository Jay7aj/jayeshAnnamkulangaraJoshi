// issue-tracker-frontend/src/types/user.ts

export interface User {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'USER'
}