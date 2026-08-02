/**
 * Seeds the configuration layer:
 *  - labelOverride defaults for every entity (matching the hardcoded labels)
 *  - statusOption defaults for every module (matching the hardcoded statuses)
 *  - suggested custom fields for the currently selected industry profile
 *
 * Run with: npm run seed-config
 */
import { PrismaClient } from "../lib/generated/prisma";
import { DEFAULT_ENTITY_LABELS } from "../lib/config/entity-labels";
import { DEFAULT_STATUS_OPTIONS } from "../lib/config/status-options";
import { getProfileConfig, isCustomProfile } from "../lib/config/industry-profiles";

const prisma = new PrismaClient();

async function seedLabelOverrides() {
  let count = 0;
  for (const [entityKey, labels] of Object.entries(DEFAULT_ENTITY_LABELS)) {
    await prisma.labelOverride.upsert({
      where: { entityKey },
      update: {},
      create: { entityKey, singular: labels.singular, plural: labels.plural },
    });
    count += 1;
  }
  console.log(`  ✓ label_overrides seeded (${count} entities)`);
}

async function seedStatusOptions() {
  let count = 0;
  for (const [moduleKey, seeds] of Object.entries(DEFAULT_STATUS_OPTIONS)) {
    const maxOrder = await prisma.statusOption.aggregate({
      where: { moduleKey },
      _max: { sortOrder: true },
    });
    let nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    for (const seed of seeds) {
      const existing = await prisma.statusOption.findUnique({
        where: { moduleKey_statusValue: { moduleKey, statusValue: seed.statusValue } },
      });

      if (!existing) {
        await prisma.statusOption.create({
          data: {
            moduleKey,
            statusValue: seed.statusValue,
            label: seed.label ?? seed.statusValue,
            color: seed.color,
            sortOrder: nextOrder,
            isDefault: Boolean(seed.isDefault),
            isActive: true,
          },
        });
        nextOrder += 1;
      }
      count += 1;
    }
  }
  console.log(`  ✓ status_options seeded (${count} statuses)`);
}

async function seedIndustryProfileSuggestions() {
  const general = await prisma.generalSetting.findFirst();
  const profileName = general?.industryProfile || "Generic";
  if (isCustomProfile(profileName)) {
    console.log(`  - industry profile "${profileName}": no preset to apply`);
    return;
  }

  const config = getProfileConfig(profileName);
  let added = 0;

  if (config.labels) {
    for (const [entityKey, label] of Object.entries(config.labels)) {
      if (!label?.singular && !label?.plural) continue;
      const existing = await prisma.labelOverride.findUnique({ where: { entityKey } });
      if (existing) continue;
      await prisma.labelOverride.create({
        data: {
          entityKey,
          singular: label.singular ?? entityKey,
          plural: label.plural ?? `${entityKey}s`,
        },
      });
      added += 1;
    }
  }

  if (config.customFields) {
    for (const [moduleKey, suggestions] of Object.entries(config.customFields)) {
      for (const suggestion of suggestions) {
        const exists = await prisma.customField.findUnique({
          where: { moduleKey_fieldKey: { moduleKey, fieldKey: suggestion.fieldKey } },
        });
        if (exists) continue;

        const maxOrder = await prisma.customField.aggregate({
          where: { moduleKey },
          _max: { displayOrder: true },
        });

        await prisma.customField.create({
          data: {
            moduleKey,
            fieldKey: suggestion.fieldKey,
            label: suggestion.label,
            type: suggestion.type,
            options: suggestion.options ?? [],
            required: suggestion.required ?? false,
            displayOrder: (maxOrder._max.displayOrder ?? -1) + 1,
            isActive: false,
          },
        });
        added += 1;
      }
    }
  }

  console.log(`  ✓ industry profile "${profileName}" applied (${added} new defaults)`);
}

async function main() {
  console.log("Seeding configuration layer...");
  await seedLabelOverrides();
  await seedStatusOptions();
  await seedIndustryProfileSuggestions();
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
