-- Add social interactions data: comments, likes, and follows
-- This script uses the actual post IDs from your database

-- First, create follows table if it doesn't exist
CREATE TABLE IF NOT EXISTS follows (
    follow_id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    followed_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, followed_id),
    CHECK (follower_id != followed_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followed ON follows(followed_id);

-- 1. Insert top-level comments on existing posts
-- Post 25: Ana's "Exploring Old Town Sarajevo"
-- Post 26: Marko's "Sunset at Dubrovnik Walls"
-- Post 27: Jelena's "Bay of Kotor Adventure"
-- Post 28: Ivan's "Belgrade Nightlife & Fortress"

INSERT INTO comments (post_id, user_id, comment_text) VALUES
    (25, 2, 'Your photo captured the light perfectly! Did you use a drone?'),          -- Marko on Ana''s post
    (26, 3, 'Tima-Irza is legendary! Their somun is heavenly 🥙'),                     -- Jelena on Marko''s post
    (27, 4, 'How long is the kayaking tour? Considering booking!'),                   -- Ivan on Jelena''s post
    (28, 1, 'Ohrid trout is LIFE. Try it grilled with lemon! 🐟'),                    -- Ana on Ivan''s post
    (29, 4, '3am wake-up? You''re a hero 😴 But worth it!')                           -- Ivan on post 29
ON CONFLICT DO NOTHING;

-- 2. Insert comment replies
-- Ana replies to Marko's question on post 25
INSERT INTO comments (post_id, user_id, parent_comment_id, comment_text)
SELECT 25, 1, c.comment_id, 'No drone — just iPhone 15 Pro at golden hour! 📱✨'
FROM comments c
WHERE c.post_id = 25 AND c.user_id = 2 AND c.comment_text LIKE '%drone%'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Jelena replies to Ivan's question on post 27
INSERT INTO comments (post_id, user_id, parent_comment_id, comment_text)
SELECT 27, 3, c.comment_id, '3 hours total — super beginner-friendly! They provide dry bags too.'
FROM comments c
WHERE c.post_id = 27 AND c.user_id = 4 AND c.comment_text LIKE '%How long%'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 3. Insert likes (Marko and Jelena like Ana's post 25)
INSERT INTO likes (user_id, post_id)
VALUES 
    (2, 25),  -- Marko likes Ana's post
    (3, 25)   -- Jelena likes Ana's post
ON CONFLICT (user_id, post_id) DO NOTHING;

-- 4. Insert follows
INSERT INTO follows (follower_id, followed_id)
VALUES
    (2, 1),  -- Marko follows Ana
    (3, 1),  -- Jelena follows Ana
    (4, 2),  -- Ivan follows Marko
    (1, 3)   -- Ana follows Jelena
ON CONFLICT (follower_id, followed_id) DO NOTHING;

-- 5. Verify the inserts
SELECT '=== COMMENTS ===' AS section;
SELECT 
    c.comment_id,
    u.username AS commenter,
    p.post_id,
    LEFT(p.title, 30) AS post_title,
    LEFT(c.comment_text, 50) AS comment_preview,
    CASE WHEN c.parent_comment_id IS NOT NULL THEN 'Reply' ELSE 'Top-level' END AS type
FROM comments c
JOIN users u ON c.user_id = u.user_id
JOIN posts p ON c.post_id = p.post_id
ORDER BY c.created_at DESC
LIMIT 10;

SELECT '=== LIKES ===' AS section;
SELECT 
    l.like_id,
    u.username AS liker,
    p.post_id,
    LEFT(p.title, 40) AS post_title
FROM likes l
JOIN users u ON l.user_id = u.user_id
JOIN posts p ON l.post_id = p.post_id
ORDER BY l.liked_at DESC
LIMIT 10;

SELECT '=== FOLLOWS ===' AS section;
SELECT 
    f.follow_id,
    follower.username AS follower,
    followed.username AS followed,
    f.created_at
FROM follows f
JOIN users follower ON f.follower_id = follower.user_id
JOIN users followed ON f.followed_id = followed.user_id
ORDER BY f.created_at DESC;

-- 6. Show summary statistics
SELECT '=== SUMMARY ===' AS section;
SELECT 
    (SELECT COUNT(*) FROM comments) AS total_comments,
    (SELECT COUNT(*) FROM comments WHERE parent_comment_id IS NOT NULL) AS total_replies,
    (SELECT COUNT(*) FROM likes) AS total_likes,
    (SELECT COUNT(*) FROM follows) AS total_follows,
    (SELECT COUNT(*) FROM notifications) AS total_notifications;
