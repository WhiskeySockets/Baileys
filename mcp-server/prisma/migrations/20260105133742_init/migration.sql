-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('DISCONNECTED', 'CONNECTING', 'CONNECTED', 'QR_REQUIRED', 'PAIRING_REQUIRED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'STICKER', 'REACTION', 'LOCATION', 'CONTACT', 'POLL', 'OTHER');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'PLAYED', 'FAILED', 'DELETED');

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "jid" TEXT,
    "name" TEXT,
    "platform" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "last_seen" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "remote_jid" TEXT NOT NULL,
    "from_me" BOOLEAN NOT NULL DEFAULT false,
    "participant" TEXT,
    "message_type" "MessageType" NOT NULL,
    "content" TEXT,
    "media_url" TEXT,
    "media_type" TEXT,
    "quoted_id" TEXT,
    "status" "MessageStatus" NOT NULL DEFAULT 'PENDING',
    "timestamp" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "jid" TEXT NOT NULL,
    "name" TEXT,
    "notify" TEXT,
    "status" TEXT,
    "img_url" TEXT,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "is_business" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_cache" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "group_jid" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "owner" TEXT,
    "description" TEXT,
    "announce" BOOLEAN NOT NULL DEFAULT false,
    "restrict" BOOLEAN NOT NULL DEFAULT false,
    "ephemeral" INTEGER,
    "participants" JSONB NOT NULL DEFAULT '[]',
    "creation" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_phone_number_key" ON "sessions"("phone_number");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateIndex
CREATE INDEX "sessions_last_seen_idx" ON "sessions"("last_seen");

-- CreateIndex
CREATE INDEX "credentials_session_id_idx" ON "credentials"("session_id");

-- CreateIndex
CREATE INDEX "credentials_session_id_category_idx" ON "credentials"("session_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_session_id_category_key_key" ON "credentials"("session_id", "category", "key");

-- CreateIndex
CREATE INDEX "messages_session_id_remote_jid_idx" ON "messages"("session_id", "remote_jid");

-- CreateIndex
CREATE INDEX "messages_session_id_timestamp_idx" ON "messages"("session_id", "timestamp");

-- CreateIndex
CREATE INDEX "messages_session_id_from_me_idx" ON "messages"("session_id", "from_me");

-- CreateIndex
CREATE UNIQUE INDEX "messages_session_id_message_id_key" ON "messages"("session_id", "message_id");

-- CreateIndex
CREATE INDEX "contacts_session_id_idx" ON "contacts"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_session_id_jid_key" ON "contacts"("session_id", "jid");

-- CreateIndex
CREATE INDEX "group_cache_session_id_idx" ON "group_cache"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_cache_session_id_group_jid_key" ON "group_cache"("session_id", "group_jid");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_cache" ADD CONSTRAINT "group_cache_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
