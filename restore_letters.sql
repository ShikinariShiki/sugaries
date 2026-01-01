-- Restore ownership of letters to the main user
-- User: Nathanael Kevin I
-- Email: natkevin143@gmail.com
-- ID: cmiycb56p0000hqr6woyrwic7

UPDATE "Letter"
SET "userId" = 'cmiycb56p0000hqr6woyrwic7'
WHERE "userId" IS NULL;

-- Verify the update
SELECT id, "recipientName", "userId" FROM "Letter";
