-- Enum
DO $$ BEGIN
  CREATE TYPE "JobStatus" AS ENUM ('queued','processing','done','failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Columns
ALTER TABLE "Job"
  ADD COLUMN IF NOT EXISTS "status" "JobStatus" NOT NULL DEFAULT 'queued',
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Trigger to keep updatedAt current
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS job_set_updated_at ON "Job";
CREATE TRIGGER job_set_updated_at
BEFORE UPDATE ON "Job"
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
