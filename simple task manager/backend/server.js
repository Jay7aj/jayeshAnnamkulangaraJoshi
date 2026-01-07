const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const authRoutes = require('./auth');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Backend running');
});

app.use(authMiddleware);

app.get('/tasks', (req, res) => {
    const userId = req.user.id;
    db.all('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',[userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/tasks',(req,res)=>{
    const userId = req.user.id;
    const {title, description} = req.body;

    if(!title){
        return res.status(400).json({error: "Title is required"});
    }
    db.run(
        'INSERT INTO tasks (title, description, completed, user_id, created_at, updated_at) VALUES(?, ?, 0, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ',
        [title, description || '', userId],
        function (err){
            if(err){
                return res.status(500).json({error:err.message});
            }
            res.status(201).json({
                id: this.lastID,
                title,
                description: description || '',
                completed: 0
            });
        }
    );
});

app.put('/tasks/:id',(req,res)=>{
    const {title, description, completed} = req.body || {};
    const taskId = req.params.id;
    const userId = req.user.id;

    if (title === undefined && description === undefined && completed === undefined ){
        return res.status(400).json({error: 'At least one field is required to update'});
    }

    const fields =[];
    const values = [];

    if(title !== undefined){
        fields.push('title = ?');
        values.push(title);
    }

    if(description !== undefined){
        fields.push('description = ?');
        values.push(description);
    }

    if(completed !== undefined){
        fields.push('completed =?');
        values.push(completed? 1: 0);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');

    values.push(taskId, userId);

    const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;

    db.run(sql, values, function(err){
        if(err){
            return res.status(500).json({error: err.message});
        }

        if(this.changes === 0){
            return res.status(404).json({error: 'Task not found'});
        }

        res.json({updated: this.changes});
    });
});

app.delete('/tasks/:id', (req,res)=>{
    const taskId = req.params.id;
    const userId = req.user.id;

    db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], function(err){
        if(err){
            return res.status(500).json({error: err.message});
        }
        if(this.changes === 0 ){
            return res.status(404).json({error: 'Task not found'});
        }
        res.json({deleted: this.changes});
    });
});

app.get('/notes',(req,res)=>{
    const userId = req.user.id;

    db.all('SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC ', [userId], (err, rows)=>{
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.json(rows);
    });
});

app.post('/notes', (req, res) => {
    const { title, content } = req.body || {};
    const userId = req.user.id;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    db.run(
        'INSERT INTO notes (title, content, user_id, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        [title, content || '', userId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                id: this.lastID,
                title,
                content: content || ''
            });
        }
    );
});

app.put('/notes/:id', (req, res) => {
    const { title, content } = req.body || {};
    const noteId = req.params.id;
    const userId = req.user.id;

    if (title === undefined && content === undefined) {
        return res.status(400).json({ error: 'Nothing to update' });
    }

    const fields = [];
    const values = [];

    if(title !== undefined){
        fields.push('title = ?');
        values.push(title);
    }

    if(content !== undefined){
        fields.push('content = ?');
        values.push(content);
    }

    // always update timestamp
    fields.push('updated_at = CURRENT_TIMESTAMP');

    values.push(noteId, userId);

    const sql = `UPDATE notes SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;

    db.run(sql, values, function(err){
        if(err) return res.status(500).json({ error: err.message });
        if(this.changes === 0) return res.status(404).json({ error: 'Note not found or not authorized' });
        res.json({ updated: this.changes });
    });
});


app.delete('/notes/:id', (req, res) => {
    const userId = req.user.id;
    const noteId = req.params.id;

    db.run('DELETE FROM notes WHERE id = ? AND user_id = ?', [noteId, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({ deleted: this.changes });
    });
});






app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});