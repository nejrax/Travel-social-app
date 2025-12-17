-- Add social interactions data: comments, likes, follows, and notifications
-- Run this after users and posts are already in the database

-- 1. Insert top-level comments (5)
INSERT INTO comments (post_id, user_id, comment_text) VALUES
    (1, 2, 'Your photo captured the light perfectly! Did you use a drone?'),          -- Marko on Ana''s post
    (2, 3, 'Tima-Irza is legendary! Their somun is heavenly 🥙'),                     -- Jelena on Marko''s post
    (3, 4, 'How long is the kayaking tour? Considering booking!'),                   -- Ivan on Jelena''s post
    (4, 1, 'Ohrid trout is LIFE. Try it grilled with lemon! 🐟'),                    -- Ana on Ivan''s post
    (5, 4, '3am wake-up? You''re a hero 😴 But worth it!');                           -- Ivan on Ana''s Dubrovnik post

-- 2. Insert comment replies (2)
-- Get the comment IDs from the above inserts to create replies
INSERT INTO comments (post_id, user_id, parent_comment_id, comment_text)
SELECT 1, 1, c.comment_id, 'No drone — just iPhone 15 Pro at golden hour! 📱✨'
FROM comments c
WHERE c.post_id = 1 AND c.user_id = 2 AND c.comment_text LIKE '%drone%'
LIMIT 1;

INSERT INTO comments (post_id, user_id, parent_comment_id, comment_text)
SELECT 3, 3, c.comment_id, '3 hours total — super beginner-friendly! They provide dry bags too.'
FROM comments c
WHERE c.post_id = 3 AND c.user_id = 4 AND c.comment_text LIKE '%How long%'
LIMIT 1;

-- 3. Insert likes (2 likes on Ana's first post)
INSERT INTO likes (user_id, post_id)
SELECT 
    u.user_id,
    p.post_id
FROM users u
CROSS JOIN posts p
WHERE u.username IN ('marko_explorer', 'jelena_adventures')
  AND p.post_id = 1
  AND NOT EXISTS (
    SELECT 1 FROM likes l 
    WHERE l.user_id = u.user_id AND l.post_id = p.post_id
  );

-- 4. Insert follows (4 follow relationships)
INSERT INTO follows (follower_id, followed_id)
SELECT 
    follower.user_id,
    followed.user_id
FROM (VALUES
    ('marko_explorer', 'traveler_ana'),      -- Marko follows Ana
    ('jelena_adventures', 'traveler_ana'),   -- Jelena follows Ana
    ('ivan_nomad', 'marko_explorer'),        -- Ivan follows Marko
    ('traveler_ana', 'jelena_adventures')    -- Ana follows Jelena
) AS v(follower_name, followed_name)
JOIN users follower ON follower.username = v.follower_name
JOIN users followed ON followed.username = v.followed_name
WHERE NOT EXISTS (
    SELECT 1 FROM follows f 
    WHERE f.follower_id = follower.user_id AND f.followed_id = followed.user_id
);

-- 5. Verify the inserts
SELECT '=== COMMENTS ===' AS section;
SELECT 
    c.comment_id,
    u.username AS commenter,
    p.post_id,
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
ORDER BY l.created_at DESC
LIMIT 10;

SELECT '=== FOLLOWS ===' AS section;
SELECT 
    f.follow_id,
    follower.username AS follower,
    followed.username AS followed
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
    (SELECT COUNT(*) FROM follows) AS total_follows;
