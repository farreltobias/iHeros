-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNASSIGNED', 'BATTLING', 'RESOLVED');

-- CreateTable
CREATE TABLE "monsters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,

    CONSTRAINT "monsters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threats" (
    "id" TEXT NOT NULL,
    "duration_time" INTEGER,
    "status" "Status" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "monster_id" TEXT NOT NULL,
    "danger_id" TEXT NOT NULL,
    "hero_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "battle_started_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "threats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dangers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "min_duration" INTEGER NOT NULL,
    "max_duration" INTEGER NOT NULL,

    CONSTRAINT "dangers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monsters_name_key" ON "monsters"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dangers_name_key" ON "dangers"("name");

-- AddForeignKey
ALTER TABLE "threats" ADD CONSTRAINT "threats_danger_id_fkey" FOREIGN KEY ("danger_id") REFERENCES "dangers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threats" ADD CONSTRAINT "threats_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
