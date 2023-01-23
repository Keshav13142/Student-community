/*
  Warnings:

  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,token]` on the table `verificationtokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Community_id_key";

-- DropIndex
DROP INDEX "Message_id_key";

-- DropIndex
DROP INDEX "accounts_providerAccountId_key";

-- DropIndex
DROP INDEX "accounts_provider_key";

-- DropIndex
DROP INDEX "verificationtokens_identifier_key";

-- DropIndex
DROP INDEX "verificationtokens_token_key";

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");
