-- Update passwords for test users with bcrypt hashed versions

-- Ana's password: jasamana2
UPDATE users SET password_hash = '$2a$10$BwUXBpiTokMOdGqK/V4lLemJqmDQXL4BQxSZikCcl3n1S/Vb1ywbO' WHERE user_id = 1;

-- Marko's password: jasammarko2
UPDATE users SET password_hash = '$2a$10$GXkJWR7hxv4Pa78c48lF3OSMybPUcEUiTWeW0ObZnJoAMrKZH8ODe' WHERE user_id = 2;

-- Jelena's password: habiba271
UPDATE users SET password_hash = '$2a$10$EWxWL5wM94so3u4rbjEm9u1uiWqVkoIUKakgyRTi5QHeKrrZbJO6i' WHERE user_id = 3;

-- Ivan's password: jasamivan2
UPDATE users SET password_hash = '$2a$10$w7voeJCqXJsMbRkyaxvy5uI/rTTdcM/FqEur0aCJwTFpUVCJYxvKG' WHERE user_id = 4;

-- Verify the updates
SELECT user_id, username, email, LEFT(password_hash, 20) as password_preview FROM users WHERE user_id IN (1,2,3,4);
