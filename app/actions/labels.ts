'use server';

import prisma from '@/lib/prisma';
import { 
  getProfileConfig,
  INDUSTRY_PROFILE_NAMES
} from '@/lib/config/industry-profiles';
import { DEFAULT_ENTITY_LABELS } from '@/lib/config/entity-labels';
import type { EntityKey } from '@/lib/config/entity-labels';
import { revalidatePath, unstable_cache, updateTag } from 'next/cache';

type EntityLabels = typeof DEFAULT_ENTITY_LABELS;

/**
 * Get the active industry profile from settings
 */
export async function getActiveProfile(): Promise<string> {
  try {
    const settings = await prisma.generalSetting.findFirst();
    return settings?.industryProfile || 'generic';
  } catch (error) {
    console.error('Error fetching active profile:', error);
    return 'generic';
  }
}

// Entity labels are read on virtually every page load (ConfigProvider mounts
// once per navigation). They change rarely — only when an admin edits Labels
// or switches industry profile — so a short-TTL cache tagged "entity-labels"
// avoids two DB round-trips (GeneralSetting + LabelOverride) per page view.
const getEntityLabelsCached = unstable_cache(
  async (): Promise<EntityLabels> => {
    const settings = await prisma.generalSetting.findFirst();
    const activeProfileKey = settings?.industryProfile || 'generic';
    const profile = getProfileConfig(activeProfileKey);

    const baseLabels: EntityLabels = { ...DEFAULT_ENTITY_LABELS };

    if (profile.labels) {
      for (const [key, value] of Object.entries(profile.labels)) {
        if (baseLabels[key as EntityKey]) {
          baseLabels[key as EntityKey] = {
            singular: value.singular ?? baseLabels[key as EntityKey].singular,
            plural: value.plural ?? baseLabels[key as EntityKey].plural,
          };
        }
      }
    }

    const overrides = await prisma.labelOverride.findMany();
    const finalLabels: EntityLabels = { ...baseLabels };

    for (const override of overrides) {
      const entityKey = override.entityKey as EntityKey;
      if (finalLabels[entityKey]) {
        finalLabels[entityKey] = {
          singular: override.singular,
          plural: override.plural,
        };
      }
    }

    return finalLabels;
  },
  ['entity-labels-resolved'],
  { revalidate: 60, tags: ['entity-labels'] }
);

/**
 * Get all entity labels (combination of profile defaults + overrides)
 */
export async function getEntityLabels(): Promise<EntityLabels> {
  try {
    return await getEntityLabelsCached();
  } catch (error) {
    console.error('Error fetching entity labels:', error);
    return { ...DEFAULT_ENTITY_LABELS };
  }
}

/**
 * Public, unauthenticated read of all entity labels (Task 20, Phase 19).
 * `getEntityLabels` above has no auth check either — the "public" naming here
 * is about intent, not a different access gate — but public pages should call
 * this one so the coupling is explicit and this is the function that gets
 * changed if a stricter admin-only variant is ever needed later. Reuses the
 * same `entity-labels`-tagged cache, so an admin editing labels in Settings
 * invalidates both the admin panel and the public site in one write.
 */
export async function getPublicEntityLabels(): Promise<EntityLabels> {
  return getEntityLabels();
}

/**
 * Get label for a specific entity (singular or plural)
 */
export async function getEntityLabel(
  entityKey: EntityKey,
  form: 'singular' | 'plural' = 'plural'
): Promise<string> {
  try {
    const labels = await getEntityLabels();
    return labels[entityKey]?.[form] || entityKey;
  } catch (error) {
    console.error('Error fetching entity label:', error);
    return entityKey;
  }
}

/**
 * Update a custom label override
 */
export async function updateEntityLabel(
  entityKey: EntityKey,
  singular: string,
  plural: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.labelOverride.upsert({
      where: { entityKey },
      create: {
        entityKey,
        singular,
        plural,
      },
      update: {
        singular,
        plural,
      },
    });
    
    updateTag('entity-labels');
    revalidatePath('/admin', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error updating entity label:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Reset a label override (revert to profile default)
 */
export async function resetEntityLabel(
  entityKey: EntityKey
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.labelOverride.delete({
      where: { entityKey },
    });
    
    updateTag('entity-labels');
    revalidatePath('/admin', 'layout');
    return { success: true };
  } catch (error) {
    // If override doesn't exist, that's fine
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return { success: true };
    }
    
    console.error('Error resetting entity label:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Apply an industry profile preset (updates setting and clears overrides)
 */
export async function applyProfilePreset(
  profileKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify profile exists
    if (!INDUSTRY_PROFILE_NAMES.includes(profileKey as any)) {
      return { success: false, error: 'Invalid profile key' };
    }
    
    // Update the industry profile setting
    const settings = await prisma.generalSetting.findFirst();
    
    if (settings) {
      await prisma.generalSetting.update({
        where: { id: settings.id },
        data: { industryProfile: profileKey },
      });
    } else {
      await prisma.generalSetting.create({
        data: { industryProfile: profileKey },
      });
    }
    
    // Clear all label overrides (optional - use profile defaults)
    await prisma.labelOverride.deleteMany();
    
    updateTag('entity-labels');
    revalidatePath('/admin', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error applying profile preset:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get all label overrides (for settings UI)
 */
export async function getLabelOverrides() {
  try {
    return await prisma.labelOverride.findMany();
  } catch (error) {
    console.error('Error fetching label overrides:', error);
    return [];
  }
}

/**
 * Get entity labels as an array (for UI display)
 */
export async function getEntityLabelsArray(): Promise<Array<{
  entityKey: string;
  singular: string;
  plural: string;
}>> {
  const labels = await getEntityLabels();
  return Object.entries(labels).map(([entityKey, value]) => ({
    entityKey,
    singular: value.singular,
    plural: value.plural,
  }));
}

/**
 * Save multiple entity labels at once
 */
export async function saveEntityLabels(
  updates: Array<{
    entityKey: string;
    singular: string;
    plural: string;
  }>
): Promise<{ success: boolean; error?: string }> {
  try {
    for (const update of updates) {
      await updateEntityLabel(
        update.entityKey as EntityKey,
        update.singular,
        update.plural
      );
    }
    
    revalidatePath('/admin', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error saving entity labels:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
