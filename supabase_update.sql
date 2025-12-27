-- Update Letter content, imageUrl, and musicUrl from Neon data
-- Run this in Supabase SQL Editor

-- Letter 1: Dina
UPDATE "Letter" SET 
  "content" = 'um.. hii dina! first of all, sorry kalau aku ganggu waktu belajar kamu sebentar... It''s not me being clingy nor trying to break your focus but rather I just realized how much I actually miss you lately. Y''know, not talking to you as much as usual makes me feel kinda empty. but, focusss on ur uas yaaa dinaaa! Semangatt yaaa myy girl dina!🫰',
  "musicUrl" = 'https://open.spotify.com/track/4uU37Nis7SshIpZ7vYf3C9?si=3vS9_Yc1SfW0W8-v72A1Vw'
WHERE id = '4f01b89b-c989-4b87-bf3b-6024c0303de9';

-- Letter 2: Diana
UPDATE "Letter" SET 
  "content" = 'Hii dian! i just wanna say thank you for being you dian. thank you for always being there whenever i need u. it''s been a tough weeks yaa buat dapet istirahat yang bener... good luck yaa dian buat uasnya! God bless youuu dian 🫶✨',
  "musicUrl" = 'https://open.spotify.com/track/6Uel7Z_f0Y1sh8vA0pue7f?si=K-7G2B9RSu6Z2Vf3C9fW3A'
WHERE id = '1012c606-63cb-4b34-abd7-ef0cdb9c52be';

-- Letter 3: Kevin (no image/music)
UPDATE "Letter" SET 
  "content" = 'semangat terus ya kak kevin, sukses terus juga buat kedepannya, be happy always!'
WHERE id = '5d38599c-1bbf-442e-8a5f-8422788d7afb';

-- Letter 4: Feivel
UPDATE "Letter" SET 
  "content" = 'Hii Feivell! 👋🏻 ... crossing paths with you is truly a once of a lifetime opportunity for me 🥺. ... Getting to know you was genuinely a highlight for me. 💐 ... semangatin kamu banget buat UAS yaa! ... Until then, good luck and take care yaaa, Feivell! ✨',
  "musicUrl" = 'https://open.spotify.com/track/60Snv0609m98nObeS8pxI?si=59bc8bc8f7c94519'
WHERE id = '40d8cace-8390-4efe-8077-483feb0280d8';

-- Letter 5: Kelas G (empty content, has large imageUrl data URI)
UPDATE "Letter" SET 
  "content" = '',
  "musicUrl" = 'https://open.spotify.com/track24-siq4T3Pk07phbwkjhpw2PL1JJPhSUK.mp3'
WHERE id = '8eb31d9a-899b-4bdb-a938-bc4938466e0e';

-- Letter 6: Kevin
UPDATE "Letter" SET 
  "content" = 'terima kasih banyak ya kak kevin dan kak muthia atas semangatnya, semoga kak kevin dan kak muthia sehat selalu dan bisa dapetin apa yang di cita citain aminn, terima kasih sekali lagi ya kak kevin dan kak muthia'
WHERE id = '9b38a854-2e20-4f27-a068-1060476c1e0d';

-- Letter 7: Kevin
UPDATE "Letter" SET 
  "content" = 'terimakasihhh banyakk kak atas support untuk besokk, semoga kak kevin dan kak muthiaa juga dilancarkan ketika ujiannyaa'
WHERE id = 'f4f3eb54-c3cc-426b-8160-031758f2b46c';

-- Letter 8: Kevin (has large imageUrl data URI)
UPDATE "Letter" SET 
  "content" = 'DUHHH KAKA ASPRAK SIAPA SII SELUCU INI YA AMPUNNN sambooooo dehhh (sarangheo besar)🤞🤞🤞 Trimakasi banyak ya supportnya dan doanya kak kevin, kak muthyaaaa....kangen deh kakk.. sehat sehat ya kak kevin, kak muthyaa.. we always miss u kak'
WHERE id = '06e8f219-ae2a-4c85-adab-2b80a0721aeb';

-- Letter 9: Kevin
UPDATE "Letter" SET 
  "content" = 'Makasiii kak Kevin dan Kak Mutia atas Semangat and Dukungan nya. MAKASIII JUGAAA UDAH BIKIN SURATT KIYOWOOOOO UNTUKK KITA SEMUAAA >////< ... AKUUU SAYANG KAK MUTIA DAN KAK KEVINNNN <3333333'
WHERE id = '1bf7fb3c-7015-442a-8bdd-e2daefc877aa';

-- Letter 10: Kevin
UPDATE "Letter" SET 
  "content" = 'thankk u sm kak kevin sama kak muthia udah bimbing kita dari awal s sampe sekarang, hope u two all the best'
WHERE id = '7a946eb0-6577-41fa-9202-16c2bfcf73f6';

-- Letter 11: Chansa (has large imageUrl data URI)
UPDATE "Letter" SET 
  "content" = 'Hiii Chansa! 👋🏻 I hope you are having a lovely day today. ... Getting to know you was genuinely a highlight for me. 💐 ... semangatin kamu banget buat UAS yaa! ... Until then, good luck and take care yaaa, Chansa! ✨'
WHERE id = 'da8d4488-b2f5-438a-bf40-59b8559a1428';

-- Letter 12: Kevin
UPDATE "Letter" SET 
  "content" = 'I READ IT ALREADYYY,,, JUJUR GAK EXPECT….. thats such a kind thing to do from you THANK YOU THAANK YOUU SO MUCH KEVINN 🥹🥹🥹🫶🫶🫶 you really are one of the sweetest souls that i have ever met in this lifetime WHICH I AM TRULY GRATEFUL FOR THAT!!! btwww uno reverse card for you too yaa kevin! i hope u never lose the spirit and courage to always try and have new experience despite the challenge you may face in it!!! onceee agaainn, THANK YOUU SO MUCH KEVINN 🥹🫶'
WHERE id = 'ce026de2-17c0-4ff6-a81f-b257d8058c0f';

-- Verify updates
SELECT id, "recipientName", LENGTH("content") as content_length, "imageUrl" IS NOT NULL as has_image, "musicUrl" IS NOT NULL as has_music
FROM "Letter"
ORDER BY "createdAt" ASC;
