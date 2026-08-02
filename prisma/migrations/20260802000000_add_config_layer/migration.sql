-- AlterTable
ALTER TABLE "general_settings" ADD COLUMN "industryProfile" TEXT NOT NULL DEFAULT 'Generic';

-- CreateTable
CREATE TABLE "label_overrides" (
    "id" TEXT NOT NULL,
    "entityKey" TEXT NOT NULL,
    "singular" TEXT NOT NULL,
    "plural" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "label_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "label_overrides_entityKey_key" ON "label_overrides"("entityKey");

-- CreateTable
CREATE TABLE "custom_fields" (
    "id" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "options" JSONB,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "custom_fields_moduleKey_fieldKey_key" ON "custom_fields"("moduleKey", "fieldKey");

-- CreateIndex
CREATE INDEX "custom_fields_moduleKey_isActive_displayOrder_idx" ON "custom_fields"("moduleKey", "isActive", "displayOrder");

-- CreateTable
CREATE TABLE "custom_field_values" (
    "id" TEXT NOT NULL,
    "customFieldId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "value" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_field_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "custom_field_values_customFieldId_recordId_key" ON "custom_field_values"("customFieldId", "recordId");

-- CreateIndex
CREATE INDEX "custom_field_values_recordId_idx" ON "custom_field_values"("recordId");

-- CreateIndex
CREATE INDEX "custom_field_values_customFieldId_idx" ON "custom_field_values"("customFieldId");

-- AddForeignKey
ALTER TABLE "custom_field_values" ADD CONSTRAINT "custom_field_values_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "custom_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "status_options" (
    "id" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "statusValue" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6b7280',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_options_moduleKey_statusValue_key" ON "status_options"("moduleKey", "statusValue");

-- CreateIndex
CREATE INDEX "status_options_moduleKey_isActive_sortOrder_idx" ON "status_options"("moduleKey", "isActive", "sortOrder");
