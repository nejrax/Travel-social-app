CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE TABLE countries (
    country_id SERIAL PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL UNIQUE,
    country_code CHAR(2) NULL
);
CREATE INDEX idx_countries_name ON countries USING gin(country_name gin_trgm_ops);
INSERT INTO countries (country_name, country_code)
VALUES ('Bosnia and Herzegovina', 'BA');


CREATE TABLE cities (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    country_id INT NOT NULL,
    CONSTRAINT fk_cities_countries 
        FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE CASCADE
);
CREATE INDEX idx_cities_country ON cities(country_id);
CREATE INDEX idx_cities_name ON cities USING gin(city_name gin_trgm_ops);

INSERT INTO cities (city_name, country_id)
VALUES ('Sarajevo', 1);
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture_url TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    city_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    google_maps_link TEXT NOT NULL,
    price NUMERIC(10,2) NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT fk_posts_users 
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_posts_cities 
        FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE RESTRICT
);
CREATE INDEX idx_posts_city_created ON posts(city_id, created_at DESC);
CREATE INDEX idx_posts_user ON posts(user_id);

CREATE TABLE likes (
    like_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    liked_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uq_likes_user_post UNIQUE (user_id, post_id),
    CONSTRAINT fk_likes_users 
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_likes_posts 
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS comments, likes, posts, users, cities, countries;



CREATE TABLE countries (
    country_id SERIAL PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL UNIQUE,
    country_code CHAR(2) NULL
);

INSERT INTO countries (country_name, country_code)
VALUES ('Bosnia and Herzegovina', 'BA');



CREATE TABLE cities (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    country_id INT NOT NULL,
    CONSTRAINT fk_cities_countries 
        FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE CASCADE
);

CREATE INDEX idx_cities_country ON cities(country_id);

INSERT INTO cities (city_name, country_id)
VALUES ('Sarajevo', 1);



CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture_url TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);



CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    city_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    google_maps_link TEXT NOT NULL,
    price NUMERIC(10,2) NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT fk_posts_users 
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_posts_cities 
        FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE RESTRICT
);

CREATE INDEX idx_posts_city_created ON posts(city_id, created_at DESC);
CREATE INDEX idx_posts_user ON posts(user_id);


CREATE TABLE likes (
    like_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    liked_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uq_likes_user_post UNIQUE (user_id, post_id),
    CONSTRAINT fk_likes_users 
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_likes_posts 
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_user ON likes(user_id);



CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT fk_comments_posts 
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_users 
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_post_created ON comments(post_id, created_at);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


DROP TABLE IF EXISTS comments CASCADE;


CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT NULL,          -- For replies: NULL = top-level, INT = reply to another comment
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign Keys
    CONSTRAINT fk_comments_post 
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user 
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_parent 
        FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE
);


CREATE INDEX idx_comments_post_created ON comments(post_id, created_at);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);  -- Critical for reply lookups

-- Auto-update `updated_at` (reuse existing function if you have it)

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();


-- 8. Notifications
CREATE TYPE notification_type AS ENUM (
    'like',
    'comment',
    'follow',
    'reply'
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    recipient_user_id INT NOT NULL,      -- who gets the notification
    actor_user_id INT NOT NULL,          -- who triggered it (e.g., liker, commenter)
    type notification_type NOT NULL,
    post_id INT NULL,                    -- for likes/comments on posts
    comment_id INT NULL,                 -- for replies
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,       -- ✅ key for unread count!
    
    -- Foreign keys
    CONSTRAINT fk_notifications_recipient 
        FOREIGN KEY (recipient_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_actor 
        FOREIGN KEY (actor_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_post 
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_comment 
        FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE
);

-- Critical indexes
CREATE INDEX idx_notifications_recipient_unread 
    ON notifications(recipient_user_id, is_read) 
    WHERE is_read = FALSE;

CREATE INDEX idx_notifications_created 
    ON notifications(created_at DESC);

	CREATE OR REPLACE FUNCTION create_notification_on_like()
RETURNS TRIGGER AS $$
DECLARE
    post_owner_id INT;
BEGIN
    -- Get the post owner (recipient)
    SELECT user_id INTO post_owner_id 
    FROM posts 
    WHERE post_id = NEW.post_id;

    -- Don't notify self (user liking their own post)
    IF post_owner_id != NEW.user_id THEN
        INSERT INTO notifications (recipient_user_id, actor_user_id, type, post_id)
        VALUES (post_owner_id, NEW.user_id, 'like', NEW.post_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_like_notification
    AFTER INSERT ON likes
    FOR EACH ROW
    EXECUTE FUNCTION create_notification_on_like();



	CREATE OR REPLACE FUNCTION create_notification_on_comment()
RETURNS TRIGGER AS $$
DECLARE
    post_owner_id INT;
BEGIN
    -- Notify post owner (unless it's their own comment)
    SELECT user_id INTO post_owner_id 
    FROM posts 
    WHERE post_id = NEW.post_id;

    IF post_owner_id != NEW.user_id THEN
        INSERT INTO notifications (recipient_user_id, actor_user_id, type, post_id, comment_id)
        VALUES (post_owner_id, NEW.user_id, 'comment', NEW.post_id, NEW.comment_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_comment_notification
    AFTER INSERT ON comments
    FOR EACH ROW
    WHEN (NEW.parent_comment_id IS NULL)  -- Only top-level comments
    EXECUTE FUNCTION create_notification_on_comment();

	CREATE OR REPLACE FUNCTION create_notification_on_reply()
RETURNS TRIGGER AS $$
DECLARE
    original_commenter_id INT;
BEGIN
    -- Get author of the comment being replied to
    SELECT user_id INTO original_commenter_id
    FROM comments
    WHERE comment_id = NEW.parent_comment_id;

    -- Don't notify self
    IF original_commenter_id != NEW.user_id THEN
        INSERT INTO notifications (recipient_user_id, actor_user_id, type, post_id, comment_id)
        VALUES (original_commenter_id, NEW.user_id, 'reply', NEW.post_id, NEW.comment_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_reply_notification
    AFTER INSERT ON comments
    FOR EACH ROW
    WHEN (NEW.parent_comment_id IS NOT NULL)  -- Only replies
    EXECUTE FUNCTION create_notification_on_reply();


	CREATE OR REPLACE FUNCTION create_notification_on_follow()
RETURNS TRIGGER AS $$
BEGIN
    -- Notify the followed user
    INSERT INTO notifications (recipient_user_id, actor_user_id, type)
    VALUES (NEW.followed_id, NEW.follower_id, 'follow');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_follow_notification
    AFTER INSERT ON follows
    FOR EACH ROW
    EXECUTE FUNCTION create_notification_on_follow();

DELETE FROM countries 
WHERE country_name = 'Bosnia and Herzegovina';




--  1. Countries 
INSERT INTO countries (country_name, country_code) VALUES
    ('Bosnia and Herzegovina', 'BA'),
    ('Croatia', 'HR'),
    ('Montenegro', 'ME'),
    ('Serbia', 'RS'),
    ('North Macedonia', 'MK');

-- Pause for ID sync
SELECT pg_sleep(0.001);

--  2. Cities (5 per country = 25) 
INSERT INTO cities (city_name, country_id) VALUES
    -- Bosnia and Herzegovina
    ('Sarajevo', 1),
    ('Mostar', 1),
    ('Banja Luka', 1),
    ('Tuzla', 1),
    ('Bihać', 1),
    -- Croatia
    ('Dubrovnik', 2),
    ('Split', 2),
    ('Zagreb', 2),
    ('Zadar', 2),
    ('Rovinj', 2),
    -- Montenegro
    ('Kotor', 3),
    ('Budva', 3),
    ('Podgorica', 3),
    ('Herceg Novi', 3),
    ('Žabljak', 3),
    -- Serbia
    ('Belgrade', 4),
    ('Novi Sad', 4),
    ('Niš', 4),
    ('Zlatibor', 4),
    ('Subotica', 4),
    -- North Macedonia
    ('Skopje', 5),
    ('Ohrid', 5),
    ('Bitola', 5),
    ('Mavrovo', 5),
    ('Struga', 5);

SELECT pg_sleep(0.001);

-- 3. Users (4) 
INSERT INTO users (username, email, password_hash, profile_picture_url) VALUES
    ('traveler_ana', 'ana@example.com', 'jasamana2', 'https://i.pravatar.cc/150?u=ana'),
    ('marko_explorer', 'marko@example.com', 'jasammarko2', 'https://i.pravatar.cc/150?u=marko'),
    ('jelena_adventures', 'jelena@example.com', 'jasamjelena2', 'https://i.pravatar.cc/150?u=jelena'),
    ('ivan_nomad', 'ivan@example.com', 'jasamivan2', 'https://i.pravatar.cc/150?u=ivan');

SELECT pg_sleep(0.001);

-- 4. Posts
INSERT INTO posts (user_id, city_id, title, description, image_url, google_maps_link, price) VALUES
    -- 1. Ana: Baščaršija, Sarajevo
    (1, 1, 'Magic of Baščaršija at Sunset', 
     'Wander through Ottoman streets, sip Bosnian coffee, and watch copper artisans at work. Don’t miss Sebilj fountain!', 
     'https://images.unsplash.com/photo-1589910291367-64119c63385b?auto=format&fit=crop&w=600', 
     'https://maps.app.goo.gl/5qXfJ7R3ZvXQvVvF9', 
     5.00),

    -- 2. Marko: Stari Most, Mostar
    (2, 2, 'Stari Most Dive & Local Ćevapi', 
     'Watch the legendary bridge jumpers at noon, then grab smoky ćevapi at Tima-Irza. Historic, thrilling, delicious!', 
     'https://images.unsplash.com/photo-1593692900234-0a8b8d5e4a5c?auto=format&fit=crop&w=600', 
     'https://maps.app.goo.gl/9Wn4Q8JYQj2ZbXwQ6', 
     8.50),

    -- 3. Jelena: Kotor Bay, Montenegro
    (3, 11, 'Kayaking the Blue Cave near Kotor', 
     'Paddle through crystal waters, explore hidden caves, and swim in emerald bays. Best tour: Kotor Kayak Adventures!', 
     'https://images.unsplash.com/photo-1553980359-6d6b4e0e0e5a?auto=format&fit=crop&w=600', 
     'https://maps.app.goo.gl/KvFbDcQZxQqQqQqQq', 
     45.00),

    -- 4. Ivan: Ohrid Lake, North Macedonia
    (4, 27, 'Sunrise Boat Tour on Lake Ohrid', 
     'Glide past ancient churches and monasteries as the sun rises. Try fresh trout at Kaneo Restaurant after!', 
     'https://images.unsplash.com/photo-1541308780117-1a9e7e0e5c7a?auto=format&fit=crop&w=600', 
     'https://maps.app.goo.gl/OhridSunrise123', 
     25.00),

    -- 5. Ana: Dubrovnik Walls, Croatia
    (1, 6, 'Walking Dubrovnik City Walls at Dawn', 
     'Beat the crowds! Walk the full 2km walls at sunrise — panoramic views of Adriatic + Stradun. Worth the 3am wake-up!', 
     'https://images.unsplash.com/photo-1533924125918-0d5d2a5b0a5c?auto=format&fit=crop&w=600', 
     'https://maps.app.goo.gl/DubrovnikWalls', 
     35.00),

    -- 6. Marko: Belgrade Fortress, Serbia
    (2, 21, 'Kalemegdan Fortress & Danube Sunset', 
     'Explore Roman ruins, Ottoman gates, and end at splavovi (river barges) for rakija and live music. Pure Belgrade vibe.', 
     'https://images.unsplash.com/photo-1524301597341-8d53b0a291e0?auto=format&fit=crop&w=600', 
     'https://maps.app.goo.gl/KalemegdanSunset', 
     0.00),

    -- 7. Jelena: Mavrovo National Park, North Macedonia
    (3, 29, 'Hiking Labin Peak in Winter', 
     'Snowshoe through silent pine forests to a mountain hut with homemade cheese and tea. Magical & untouched.', 
     'https://images.unsplash.com/photo-1505142468733-90a9e7e3f26b?auto=format&fit=crop&w=600', 
     'https://maps.app.goo.gl/MavrovoHike', 
     15.00);

SELECT pg_sleep(0.001);

-- 5. Likes (15) — Spread across posts & users
INSERT INTO likes (user_id, post_id) VALUES
    (2, 1), (3, 1), (4, 1),          -- 3 likes on Ana's Sarajevo post
    (1, 2), (3, 2), (4, 2), (1, 6),  -- 4 likes on Marko's posts
    (1, 3), (2, 3), (4, 3),          -- 3 likes on Jelena's Kotor post
    (1, 4), (2, 4), (3, 4),          -- 3 likes on Ivan's Ohrid post
    (2, 5), (4, 5);                   -- 2 likes on Ana's Dubrovnik post

SELECT pg_sleep(0.001);

--  6. Comments 
-- Top-level comments
INSERT INTO comments (post_id, user_id, comment_text) VALUES
    (1, 2, 'Your photo captured the light perfectly! Did you use a drone?'),          -- Marko on Ana's post
    (2, 3, 'Tima-Irza is legendary! Their somun is heavenly 🥙'),                     -- Jelena on Marko's post
    (3, 4, 'How long is the kayaking tour? Considering booking!'),                   -- Ivan on Jelena's post
    (4, 1, 'Ohrid trout is LIFE. Try it grilled with lemon! 🐟'),                    -- Ana on Ivan's post
    (5, 4, '3am wake-up? You’re a hero 😴 But worth it!');                           -- Ivan on Ana's Dubrovnik post

-- Get comment IDs for replies (assume sequential: first 5 = IDs 1–5)
-- Reply to comment #1 (Marko's question)
INSERT INTO comments (post_id, user_id, parent_comment_id, comment_text) VALUES
    (1, 1, 1, 'No drone — just iPhone 15 Pro at golden hour! 📱✨');                 -- Ana replies to Marko

-- Reply to comment #3 (Ivan's question)
INSERT INTO comments (post_id, user_id, parent_comment_id, comment_text) VALUES
    (3, 3, 3, '3 hours total — super beginner-friendly! They provide dry bags too.'); -- Jelena replies to Ivan

SELECT pg_sleep(0.001);

-- 7. Follows (4) 
INSERT INTO follows (follower_id, followed_id) VALUES
    (2, 1),  -- Marko follows Ana
    (3, 1),  -- Jelena follows Ana
    (4, 2),  -- Ivan follows Marko
    (1, 3);  -- Ana follows Jelena



-- Final: Verify counts 
SELECT 
    (SELECT COUNT(*) FROM users) AS users,
    (SELECT COUNT(*) FROM countries) AS countries,
    (SELECT COUNT(*) FROM cities) AS cities,
    (SELECT COUNT(*) FROM posts) AS posts,
    (SELECT COUNT(*) FROM likes) AS likes,
    (SELECT COUNT(*) FROM comments) AS comments,
    (SELECT COUNT(*) FROM follows) AS follows,
    (SELECT COUNT(*) FROM notifications) AS notifications;

SELECT country_id, country_name FROM countries ORDER BY country_id;

INSERT INTO countries (country_name, country_code)
VALUES 
    ('Bosnia and Herzegovina', 'BA'),
    ('Croatia', 'HR'),
    ('Montenegro', 'ME'),
    ('Serbia', 'RS'),
    ('North Macedonia', 'MK')
ON CONFLICT (country_name) DO NOTHING;


INSERT INTO cities (city_name, country_id)
SELECT city, c.country_id
FROM (VALUES 
    ('Sarajevo', 'Bosnia and Herzegovina'),
    ('Mostar', 'Bosnia and Herzegovina'),
    ('Banja Luka', 'Bosnia and Herzegovina'),
    ('Dubrovnik', 'Croatia'),
    ('Split', 'Croatia'),
    ('Zagreb', 'Croatia'),
    ('Kotor', 'Montenegro'),
    ('Budva', 'Montenegro'),
    ('Podgorica', 'Montenegro'),
    ('Belgrade', 'Serbia'),
    ('Novi Sad', 'Serbia'),
    ('Skopje', 'North Macedonia'),
    ('Ohrid', 'North Macedonia')
) AS v(city, country_name)
JOIN countries c USING (country_name)
ON CONFLICT DO NOTHING;  
SELECT 
    co.country_name,
    COUNT(ci.city_id) AS city_count
FROM countries co
LEFT JOIN cities ci ON co.country_id = ci.country_id
GROUP BY co.country_id, co.country_name
ORDER BY co.country_id;

	
SELECT 
    c.city_name,
    co.country_name,
    COUNT(*) AS count
FROM cities c
JOIN countries co ON c.country_id = co.country_id
GROUP BY c.city_name, co.country_name
HAVING COUNT(*) > 1;

SELECT 
    co.country_name,
    STRING_AGG(c.city_name, ', ' ORDER BY c.city_name) AS cities
FROM countries co
JOIN cities c ON co.country_id = c.country_id
GROUP BY co.country_id, co.country_name
ORDER BY co.country_name;


SELECT 
    c1.city_id,
    c1.city_name,
    co.country_name
FROM cities c1
JOIN countries co ON c1.country_id = co.country_id
WHERE c1.city_id NOT IN (
    SELECT MIN(c2.city_id)
    FROM cities c2
    WHERE c2.city_name = c1.city_name 
      AND c2.country_id = c1.country_id
);
DELETE FROM cities
WHERE city_id NOT IN (
    SELECT MIN(city_id)
    FROM cities
    GROUP BY city_name, country_id
);


ALTER TABLE cities 
ADD CONSTRAINT uq_cities_name_country 
UNIQUE (city_name, country_id);





INSERT INTO posts (user_id, city_id, title, description, image_url, google_maps_link, price)
SELECT 
    u.user_id,
    c.city_id,
    v.title,
    v.description,
    TRIM(v.image_url),    -- removes accidental trailing spaces
    TRIM(v.google_maps_link),
    v.price
FROM (VALUES
    ('traveler_ana', 'Sarajevo', 'Bosnia and Herzegovina', 'Magic of Baščaršija at Sunset', 
     'Wander through Ottoman streets, sip Bosnian coffee, and watch copper artisans at work.', 
     'https://images.unsplash.com/photo-1589910291367-64119c63385b?w=600',
     'https://maps.app.goo.gl/5qXfJ7R3ZvXQvVvF9',
     5.00),

    ('marko_explorer', 'Mostar', 'Bosnia and Herzegovina', 'Stari Most Dive & Local Ćevapi', 
     'Watch the legendary bridge jumpers at noon, then grab smoky ćevapi at Tima-Irza.', 
     'https://images.unsplash.com/photo-1593692900234-0a8b8d5e4a5c?w=600',
     'https://maps.app.goo.gl/9Wn4Q8JYQj2ZbXwQ6',
     8.50),

    ('jelena_adventures', 'Kotor', 'Montenegro', 'Kayaking the Blue Cave near Kotor', 
     'Paddle through crystal waters, explore hidden caves, and swim in emerald bays.', 
     'https://images.unsplash.com/photo-1553980359-6d6b4e0e0e5a?w=600',
     'https://maps.app.goo.gl/KvFbDcQZxQqQqQqQq',
     45.00),

    ('ivan_nomad', 'Ohrid', 'North Macedonia', 'Sunrise Boat Tour on Lake Ohrid', 
     'Glide past ancient churches and monasteries as the sun rises.', 
     'https://images.unsplash.com/photo-1541308780117-1a9e7e0e5c7a?w=600',
     'https://maps.app.goo.gl/OhridSunrise123',
     25.00),

    ('traveler_ana', 'Dubrovnik', 'Croatia', 'Walking Dubrovnik City Walls at Dawn', 
     'Beat the crowds! Walk the full 2km walls at sunrise — panoramic views of Adriatic.', 
     'https://images.unsplash.com/photo-1533924125918-0d5d2a5b0a5c?w=600',
     'https://maps.app.goo.gl/DubrovnikWalls',
     35.00),

    ('marko_explorer', 'Belgrade', 'Serbia', 'Kalemegdan Fortress & Danube Sunset', 
     'Explore Roman ruins, Ottoman gates, and end at splavovi for rakija and live music.', 
     'https://images.unsplash.com/photo-1524301597341-8d53b0a291e0?w=600',
     'https://maps.app.goo.gl/KalemegdanSunset',
     0.00),

    ('jelena_adventures', 'Mavrovo', 'North Macedonia', 'Hiking Labin Peak in Winter', 
     'Snowshoe through silent pine forests to a mountain hut with homemade cheese and tea.', 
     'https://images.unsplash.com/photo-1505142468733-90a9e7e3f26b?w=600',
     'https://maps.app.goo.gl/MavrovoHike',
     15.00)
) AS v(username, city_name, country_name, title, description, image_url, google_maps_link, price)
JOIN users u ON u.username = v.username
JOIN cities c ON c.city_name = v.city_name
JOIN countries co ON c.country_id = co.country_id AND co.country_name = v.country_name
WHERE NOT EXISTS (
    SELECT 1 FROM posts p 
    WHERE p.title = v.title AND p.user_id = u.user_id
);

INSERT INTO likes (user_id, post_id)
SELECT 
    liker.user_id,
    p.post_id
FROM (VALUES
    ('marko_explorer', 'Magic of Baščaršija at Sunset'),
    ('jelena_adventures', 'Magic of Baščaršija at Sunset')
) AS v(liker_username, post_title)
JOIN users liker ON liker.username = v.liker_username
JOIN posts p ON p.title = v.post_title AND p.user_id = (
    SELECT user_id FROM users WHERE username = 'traveler_ana'
);

SELECT COUNT(*) AS user_count FROM users;



SELECT 
    user_id,
    username,
    email,
    created_at
FROM users
ORDER BY user_id;


WITH post_lookup AS (
    SELECT 
        p.post_id,
        p.title,
        ua.username AS author_username
    FROM posts p
    JOIN users ua ON p.user_id = ua.user_id
),
user_lookup AS (
    SELECT user_id, username FROM users
),
-- Top-level comments
top_comments AS (
    INSERT INTO comments (post_id, user_id, comment_text)
    SELECT 
        pl.post_id,
        ul.user_id,
        v.comment_text
    FROM (VALUES
        ('Magic of Baščaršija at Sunset', 'traveler_ana', 'marko_explorer', 'Your photo captured the light perfectly! Did you use a drone?'),
        ('Stari Most Dive & Local Ćevapi', 'marko_explorer', 'jelena_adventures', 'Tima-Irza is legendary! Their somun is heavenly 🥙'),
        ('Kayaking the Blue Cave near Kotor', 'jelena_adventures', 'ivan_nomad', 'How long is the kayaking tour? Considering booking!'),
        ('Sunrise Boat Tour on Lake Ohrid', 'ivan_nomad', 'traveler_ana', 'Ohrid trout is LIFE. Try it grilled with lemon! 🐟'),
        ('Walking Dubrovnik City Walls at Dawn', 'traveler_ana', 'ivan_nomad', '3am wake-up? You’re a hero 😴 But worth it!')
    ) AS v(post_title, author, commenter, comment_text)
    JOIN post_lookup pl 
        ON pl.title = v.post_title AND pl.author_username = v.author
    JOIN user_lookup ul ON ul.username = v.commenter
    WHERE NOT EXISTS (
        SELECT 1 FROM comments c 
        WHERE c.post_id = pl.post_id AND c.user_id = ul.user_id AND c.comment_text = v.comment_text
    )
    RETURNING comment_id, post_id, user_id, comment_text
),
-- Now get IDs of inserted top comments for replies
top_comment_ids AS (
    SELECT 
        c.comment_id,
        p.title AS post_title,
        ua.username AS author_username,
        uc.username AS commenter_username
    FROM comments c
    JOIN posts p ON c.post_id = p.post_id
    JOIN users ua ON p.user_id = ua.user_id
    JOIN users uc ON c.user_id = uc.user_id
    WHERE (p.title, ua.username, uc.username) IN (
        ('Magic of Baščaršija at Sunset', 'traveler_ana', 'marko_explorer'),
        ('Kayaking the Blue Cave near Kotor', 'jelena_adventures', 'ivan_nomad')
    )
)
-- Insert replies (2)
INSERT INTO comments (post_id, user_id, parent_comment_id, comment_text)
SELECT 
    pl.post_id,
    ul.user_id,
    tci.comment_id,
    v.reply_text
FROM (VALUES
    ('Magic of Baščaršija at Sunset', 'traveler_ana', 'traveler_ana', 'No drone — just iPhone 15 Pro at golden hour! 📱✨'),
    ('Kayaking the Blue Cave near Kotor', 'jelena_adventures', 'jelena_adventures', '3 hours total — super beginner-friendly! They provide dry bags too.')
) AS v(post_title, author, replier, reply_text)
JOIN post_lookup pl 
    ON pl.title = v.post_title AND pl.author_username = v.author
JOIN user_lookup ul ON ul.username = v.replier
JOIN top_comment_ids tci 
    ON tci.post_title = v.post_title 
    AND tci.author_username = v.author 
    AND tci.commenter_username = 
        CASE v.post_title 
            WHEN 'Magic of Baščaršija at Sunset' THEN 'marko_explorer'
            WHEN 'Kayaking the Blue Cave near Kotor' THEN 'ivan_nomad'
        END;


		SELECT 
    c.comment_text,
    u.username AS commenter,
    p.title AS post_title,
    pa.username AS post_author
FROM comments c
JOIN users u ON c.user_id = u.user_id
JOIN posts p ON c.post_id = p.post_id
JOIN users pa ON p.user_id = pa.user_id
ORDER BY c.created_at DESC;


--TESt DA VIDIM JESU LI SVE TABELE TU
SELECT 
    co.country_name AS country,
    STRING_AGG(c.city_name, ', ' ORDER BY c.city_name) AS cities
FROM countries co
LEFT JOIN cities c ON co.country_id = c.country_id
GROUP BY co.country_id, co.country_name
ORDER BY co.country_name;

SELECT 
    user_id,
    username,
    email,
    created_at::DATE AS joined
FROM users
ORDER BY user_id;

SELECT 
    p.post_id,
    u.username AS author,
    c.city_name || ', ' || co.country_name AS location,
    p.title,
    p.price,
    p.created_at::DATE AS posted
FROM posts p
JOIN users u ON p.user_id = u.user_id
JOIN cities c ON p.city_id = c.city_id
JOIN countries co ON c.country_id = co.country_id
ORDER BY p.created_at DESC;

SELECT 
    c1.comment_id,
    u1.username AS commenter,
    p.title AS post,
    c1.comment_text AS comment,
    CASE 
        WHEN c2.comment_id IS NOT NULL 
        THEN '↳ Reply to: ' || u2.username || ': "' || c2.comment_text || '"'
        ELSE ''
    END AS reply_to
FROM comments c1
JOIN users u1 ON c1.user_id = u1.user_id
JOIN posts p ON c1.post_id = p.post_id
LEFT JOIN comments c2 ON c1.parent_comment_id = c2.comment_id
LEFT JOIN users u2 ON c2.user_id = u2.user_id
ORDER BY c1.created_at;

SELECT 
    f.follow_id,
    follower.username AS follower,
    followed.username AS following,
    f.followed_at::DATE AS since
FROM follows f
JOIN users follower ON f.follower_id = follower.user_id
JOIN users followed ON f.followed_id = followed.user_id
ORDER BY f.followed_at;

SELECT 
    l.like_id,
    u.username AS liked_by,
    p.title AS post_title,
    author.username AS post_author,
    l.liked_at::DATE AS liked_on
FROM likes l
JOIN users u ON l.user_id = u.user_id
JOIN posts p ON l.post_id = p.post_id
JOIN users author ON p.user_id = author.user_id
ORDER BY l.liked_at DESC;

SELECT 
    n.notification_id,
    recipient.username AS to_user,
    actor.username AS from_user,
    n.type,
    CASE 
        WHEN n.type = 'like' THEN 'liked your post'
        WHEN n.type = 'comment' THEN 'commented on your post'
        WHEN n.type = 'reply' THEN 'replied to your comment'
        WHEN n.type = 'follow' THEN 'followed you'
    END AS action,
    n.is_read,
    n.created_at::DATE AS date
FROM notifications n
JOIN users recipient ON n.recipient_user_id = recipient.user_id
JOIN users actor ON n.actor_user_id = actor.user_id
ORDER BY n.created_at DESC
LIMIT 20;  -- last 20


--UPDATE POSTS AND FOLLOWS

INSERT INTO posts (user_id, city_id, title, description, image_url, google_maps_link, price)
SELECT 
    u.user_id,
    c.city_id,
    v.title,
    v.description,
    TRIM(v.image_url),
    TRIM(v.google_maps_link),
    v.price
FROM (VALUES
    ('traveler_ana', 'Sarajevo', 'Bosnia and Herzegovina', 'Magic of Baščaršija at Sunset', 
     'Wander through Ottoman streets, sip Bosnian coffee, and watch copper artisans at work.', 
     'https://images.unsplash.com/photo-1589910291367-64119c63385b?w=600',
     'https://maps.app.goo.gl/5qXfJ7R3ZvXQvVvF9',
     5.00),

    ('marko_explorer', 'Mostar', 'Bosnia and Herzegovina', 'Stari Most Dive & Local Ćevapi', 
     'Watch the legendary bridge jumpers at noon, then grab smoky ćevapi at Tima-Irza.', 
     'https://images.unsplash.com/photo-1593692900234-0a8b8d5e4a5c?w=600',
     'https://maps.app.goo.gl/9Wn4Q8JYQj2ZbXwQ6',
     8.50),

    ('jelena_adventures', 'Kotor', 'Montenegro', 'Kayaking the Blue Cave near Kotor', 
     'Paddle through crystal waters, explore hidden caves, and swim in emerald bays.', 
     'https://images.unsplash.com/photo-1553980359-6d6b4e0e0e5a?w=600',
     'https://maps.app.goo.gl/KvFbDcQZxQqQqQqQq',
     45.00),

    ('ivan_nomad', 'Ohrid', 'North Macedonia', 'Sunrise Boat Tour on Lake Ohrid', 
     'Glide past ancient churches and monasteries as the sun rises.', 
     'https://images.unsplash.com/photo-1541308780117-1a9e7e0e5c7a?w=600',
     'https://maps.app.goo.gl/OhridSunrise123',
     25.00),

    ('traveler_ana', 'Dubrovnik', 'Croatia', 'Walking Dubrovnik City Walls at Dawn', 
     'Beat the crowds! Walk the full 2km walls at sunrise — panoramic views of Adriatic.', 
     'https://images.unsplash.com/photo-1533924125918-0d5d2a5b0a5c?w=600',
     'https://maps.app.goo.gl/DubrovnikWalls',
     35.00),

    ('marko_explorer', 'Belgrade', 'Serbia', 'Kalemegdan Fortress & Danube Sunset', 
     'Explore Roman ruins, Ottoman gates, and end at splavovi for rakija and live music.', 
     'https://images.unsplash.com/photo-1524301597341-8d53b0a291e0?w=600',
     'https://maps.app.goo.gl/KalemegdanSunset',
     0.00),

    ('jelena_adventures', 'Mavrovo', 'North Macedonia', 'Hiking Labin Peak in Winter', 
     'Snowshoe through silent pine forests to a mountain hut with homemade cheese and tea.', 
     'https://images.unsplash.com/photo-1505142468733-90a9e7e3f26b?w=600',
     'https://maps.app.goo.gl/MavrovoHike',
     15.00)
) AS v(username, city_name, country_name, title, description, image_url, google_maps_link, price)
JOIN users u ON u.username = v.username
JOIN cities c ON c.city_name = v.city_name
JOIN countries co ON c.country_id = co.country_id AND co.country_name = v.country_name
WHERE NOT EXISTS (
    SELECT 1 FROM posts p 
    WHERE p.title = v.title AND p.user_id = u.user_id
);


SELECT 
    p.post_id,
    u.username AS author,
    c.city_name || ', ' || co.country_name AS location,
    p.title,
    p.price,
    p.created_at::DATE AS posted
FROM posts p
JOIN users u ON p.user_id = u.user_id
JOIN cities c ON p.city_id = c.city_id
JOIN countries co ON c.country_id = co.country_id
ORDER BY p.created_at DESC;



-- Top-level comments
INSERT INTO comments (post_id, user_id, comment_text)
SELECT 
    p.post_id,
    u.user_id,
    v.comment_text
FROM (VALUES
    ('Magic of Baščaršija at Sunset', 'traveler_ana', 'marko_explorer', 'Your photo captured the light perfectly! Did you use a drone?'),
    ('Stari Most Dive & Local Ćevapi', 'marko_explorer', 'jelena_adventures', 'Tima-Irza is legendary! Their somun is heavenly 🥙'),
    ('Kayaking the Blue Cave near Kotor', 'jelena_adventures', 'ivan_nomad', 'How long is the kayaking tour? Considering booking!'),
    ('Sunrise Boat Tour on Lake Ohrid', 'ivan_nomad', 'traveler_ana', 'Ohrid trout is LIFE. Try it grilled with lemon! 🐟'),
    ('Walking Dubrovnik City Walls at Dawn', 'traveler_ana', 'ivan_nomad', '3am wake-up? You’re a hero 😴 But worth it!')
) AS v(post_title, author, commenter, comment_text)
JOIN posts p ON p.title = v.post_title
JOIN users post_author ON p.user_id = post_author.user_id AND post_author.username = v.author
JOIN users u ON u.username = v.commenter
WHERE NOT EXISTS (
    SELECT 1 FROM comments c 
    WHERE c.post_id = p.post_id AND c.user_id = u.user_id AND c.comment_text = v.comment_text
);

-- Replies (2)
WITH top_comments AS (
    SELECT 
        c.comment_id,
        p.title AS post_title,
        ua.username AS author_username,
        uc.username AS commenter_username
    FROM comments c
    JOIN posts p ON c.post_id = p.post_id
    JOIN users ua ON p.user_id = ua.user_id
    JOIN users uc ON c.user_id = uc.user_id
    WHERE (p.title, ua.username, uc.username) IN (
        ('Magic of Baščaršija at Sunset', 'traveler_ana', 'marko_explorer'),
        ('Kayaking the Blue Cave near Kotor', 'jelena_adventures', 'ivan_nomad')
    )
)
INSERT INTO comments (post_id, user_id, parent_comment_id, comment_text)
SELECT 
    p.post_id,
    u.user_id,
    tc.comment_id,
    v.reply_text
FROM (VALUES
    ('Magic of Baščaršija at Sunset', 'traveler_ana', 'traveler_ana', 'No drone — just iPhone 15 Pro at golden hour! 📱✨'),
    ('Kayaking the Blue Cave near Kotor', 'jelena_adventures', 'jelena_adventures', '3 hours total — super beginner-friendly! They provide dry bags too.')
) AS v(post_title, author, replier, reply_text)
JOIN posts p ON p.title = v.post_title
JOIN users post_author ON p.user_id = post_author.user_id AND post_author.username = v.author
JOIN users u ON u.username = v.replier
JOIN top_comments tc 
    ON tc.post_title = v.post_title 
    AND tc.author_username = v.author 
    AND tc.commenter_username = 
        CASE v.post_title 
            WHEN 'Magic of Baščaršija at Sunset' THEN 'marko_explorer'
            WHEN 'Kayaking the Blue Cave near Kotor' THEN 'ivan_nomad'
        END;


INSERT INTO likes (user_id, post_id)
SELECT 
    u.user_id,
    p.post_id
FROM (VALUES
    ('marko_explorer', 'Magic of Baščaršija at Sunset'),
    ('jelena_adventures', 'Magic of Baščaršija at Sunset'),
    ('ivan_nomad', 'Magic of Baščaršija at Sunset'),
    ('traveler_ana', 'Stari Most Dive & Local Ćevapi'),
    ('jelena_adventures', 'Stari Most Dive & Local Ćevapi'),
    ('ivan_nomad', 'Stari Most Dive & Local Ćevapi'),
    ('traveler_ana', 'Kotor Bay Kayaking'),
    ('marko_explorer', 'Kotor Bay Kayaking'),
    ('ivan_nomad', 'Kotor Bay Kayaking'),
    ('traveler_ana', 'Sunrise Boat Tour on Lake Ohrid'),
    ('marko_explorer', 'Sunrise Boat Tour on Lake Ohrid'),
    ('jelena_adventures', 'Sunrise Boat Tour on Lake Ohrid'),
    ('marko_explorer', 'Walking Dubrovnik City Walls'),
    ('ivan_nomad', 'Walking Dubrovnik City Walls'),
    ('traveler_ana', 'Hiking Labin Peak')
) AS v(liker, post_title)
JOIN users u ON u.username = v.liker
JOIN posts p ON p.title = v.post_title
WHERE NOT EXISTS (
    SELECT 1 FROM likes l 
    WHERE l.user_id = u.user_id AND l.post_id = p.post_id
);

		INSERT INTO follows (follower_id, followed_id)
SELECT 
    follower.user_id,
    followed.user_id
FROM (VALUES
    ('marko_explorer', 'traveler_ana'),  -- Marko follows Ana
    ('jelena_adventures', 'traveler_ana'),  -- Jelena follows Ana
    ('ivan_nomad', 'marko_explorer'),  -- Ivan follows Marko
    ('traveler_ana', 'jelena_adventures')  -- Ana follows Jelena
) AS v(follower, followed)
JOIN users follower ON follower.username = v.follower
JOIN users followed ON followed.username = v.followed
WHERE NOT EXISTS (
    SELECT 1 FROM follows f 
    WHERE f.follower_id = follower.user_id AND f.followed_id = followed.user_id
);

SELECT 
    n.notification_id,
    recipient.username AS to_user,
    actor.username AS from_user,
    n.type,
    n.is_read,
    n.created_at::DATE AS date
FROM notifications n
JOIN users recipient ON n.recipient_user_id = recipient.user_id
JOIN users actor ON n.actor_user_id = actor.user_id
ORDER BY n.created_at DESC;