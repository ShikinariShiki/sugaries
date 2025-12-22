-- Supabase Data Import from Neon
-- Generated: 2025-12-21
-- Data: 5 Users, 12 Letters, 3 Accounts

-- ==========================================
-- INSERT USERS FIRST (required for foreign keys)
-- ==========================================
INSERT INTO "User" ("id", "name", "email", "role", "isOnboarded", "createdAt", "updatedAt") VALUES
('cmiycb56p0000hqr6woyrwic7', 'Nathanael Kevin I', 'natkevin143@gmail.com', 'user', true, '2025-12-09 08:50:17.473', '2025-12-09 08:50:17.473'),
('cmiyeup6v0000pisitbxsu97s', 'These Pro', 'theseproyt@gmail.com', 'user', false, '2025-12-09 10:01:29.096', '2025-12-09 10:01:29.096'),
('cmiyg3ehx0000lgdbbfnkxens', 'Nathanael Kevin Irwanto', 'natkevinirwanto@student.ub.ac.id', 'user', false, '2025-12-09 10:36:14.757', '2025-12-09 10:36:14.757'),
('cmiymz0720000ax5lzzbp6gvz', 'Shiki Manmaru', 'shikimanmaru@gmail.com', 'user', true, '2025-12-09 13:48:46.909', '2025-12-09 13:48:46.909'),
('cmj12f28m00003svnbccyp51j', 'Test User', 'test@gmail.com', 'user', false, '2025-12-11 06:36:42.646', '2025-12-11 06:36:42.646')
ON CONFLICT ("id") DO NOTHING;

-- ==========================================
-- INSERT ACCOUNTS (OAuth connections)
-- ==========================================
INSERT INTO "Account" ("id", "userId", "provider", "type", "providerAccountId") VALUES
('cmiycb5720002hqr6wgervzi8', 'cmiycb56p0000hqr6woyrwic7', 'google', 'oauth', '115379627518428147511'),
('cmiyeup760002pisikxally9f', 'cmiyeup6v0000pisitbxsu97s', 'google', 'oauth', '107114363630687672652'),
('cmiyg3ei90002lgdb5ccno59n', 'cmiyg3ehx0000lgdbbfnkxens', 'google', 'oauth', '109963208177397617657')
ON CONFLICT ("id") DO NOTHING;

-- ==========================================
-- INSERT LETTERS
-- ==========================================
INSERT INTO "Letter" ("id", "recipientName", "content", "createdAt", "isOpened", "isReply", "pinHash", "letterColor", "letterFont") VALUES
('4f01b89b-c989-4b87-bf3b-6024c0303de9', 'Dina', 'um.. hii dina! first of all, sorry kalau aku ganggu waktu belajar kamu sebentar... It''s not me being clingy nor trying to break your focus but rather I just realized how much I actually miss you lately. Y''know, not talking to you as much feels kinda empty and I keep wondering how you''re surviving through this chaotic exam week...', '2025-12-08 14:20:41.152', true, false, '$2a$10$QcQVwTgqH3NM/qL90dsKTeXhAHbiD7BNsZUzwa1frSqKduUkW/QJi', 'peach', 'poppins')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Letter" ("id", "recipientName", "content", "createdAt", "isOpened", "isReply", "pinHash", "musicUrl", "letterColor", "letterFont") VALUES
('1012c606-63cb-4b34-abd7-ef0cdb9c52be', 'Diana', 'um.. hii diana! first of all, i just wanna say how incredibly proud i am of you... It''s not me being overprotective nor nagging you to rest but rather I genuinely worry because I see how much load you''re carrying right now...', '2025-12-08 14:36:51.422', true, false, '$2a$10$Jg3/iuvYIVV6iRctXNtwUuYG7Mp7ASMSj1iKM/BPxB8qUI.5KkX3y', 'https://music.youtube.com/watch?v=Cwg9B0HJUMo&si=6BU30-DJjMEskAku', 'pink', 'handwriting')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Letter" ("id", "recipientName", "senderName", "content", "createdAt", "isOpened", "isReply", "letterColor", "letterFont") VALUES
('5d38599c-1bbf-442e-8a5f-8422788d7afb', 'Kevin', 'Diana', 'Wow Kevin? are u seriously write down this bunch of a full wonderful text to me? 😭😭😭😭 brooo idk how to say but you''re really is a caring person! 🥹🥹🥹...', '2025-12-08 14:49:13.097', true, true, 'pink', 'handwriting')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Letter" ("id", "recipientName", "content", "createdAt", "isOpened", "isReply", "musicUrl", "letterColor", "letterFont") VALUES
('40d8cace-8390-4efe-8077-483feb0280d8', 'Feivel', 'um.. hii feivel! first of all, i just wanna remind you of something important... It''s not me being patronizing nor trying to scare you but rather I genuinely understand that surviving tekdus is seriously no joke...', '2025-12-08 15:30:39.469', true, false, 'https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track2-EYAz7PN9Ur27ZmaVVgGVb0Nd1OY11O.mp3', 'pink', 'handwriting')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Letter" ("id", "recipientName", "content", "createdAt", "isOpened", "isReply", "letterColor", "letterFont") VALUES
('8eb31d9a-899b-4bdb-a938-bc4938466e0e', 'Kelas G!', 'Haloo Kelas G! 👋 Aku IZINN masuk yaaa 🫸 Maaf ganggu waktu belajarnya bentar yaa, ada pesan kecil nih dari aku sama Kak Muthia khusus buat kalian...', '2025-12-10 12:18:30.596', true, false, 'pink', 'handwriting')
ON CONFLICT ("id") DO NOTHING;
