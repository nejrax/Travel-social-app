const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get notifications for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        n.notification_id,
        n.type,
        n.is_read,
        n.created_at,
        actor.user_id as actor_id,
        actor.username as actor_username,
        actor.profile_picture_url as actor_avatar,
        n.post_id,
        n.comment_id,
        p.title as post_title,
        p.image_url as post_image
       FROM notifications n
       JOIN users actor ON n.actor_user_id = actor.user_id
       LEFT JOIN posts p ON n.post_id = p.post_id
       WHERE n.recipient_user_id = $1
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE notification_id = $1 AND recipient_user_id = $2
       RETURNING *`,
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    await pool.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE recipient_user_id = $1 AND is_read = false`,
      [req.user.id]
    );
    
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
