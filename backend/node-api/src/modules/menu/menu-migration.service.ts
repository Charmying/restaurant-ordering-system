import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { LocalizedString } from '../../common/types/i18n.types';
import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';
import type { MigrationResult } from './menu-migration.types';

class MigrationValueConverter {
  private static isValidLocalizedString(value: unknown): value is LocalizedString {
    if (typeof value !== 'object' || value === null) return false;
    const obj = value as Record<string, unknown>;
    return (typeof obj.zh === 'string' && typeof obj.en === 'string' && Object.keys(obj).every(key => key === 'zh' || key === 'en'));
  }

  static toLocalizedString(value: unknown): LocalizedString {
    if (this.isValidLocalizedString(value))  return value;
    if (typeof value === 'string') return { zh: value, en: value };
    if (typeof value === 'object' && value !== null) return { zh: '', en: '' };

    return { zh: '', en: '' };
  }
}

@Injectable()
export class MenuMigrationService {
  private readonly logger = new Logger(MenuMigrationService.name);

  constructor(
    @InjectModel(MenuItem.name)
    private readonly menuItemModel: Model<MenuItemDocument>
  ) {}

  async migrateMenuItemsToLocalizedString(): Promise<MigrationResult> {
    try {
      const items = await this.menuItemModel.find({});
      let migratedCount = 0;
      for (const item of items) {
        if (this.migrateItem(item)) {
          try {
            await item.save();
            migratedCount++;
          } catch (saveError) {
            this.logger.error(`Failed to save migrated item ${item._id}:`, saveError);
          }
        }
      }

      const message = `✅ Completed: ${migratedCount}/${items.length} items migrated`;
      this.logger.log(message);

      return { success: true, count: migratedCount };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Migration failed:', errorMessage);
      return { success: false, count: 0, error: errorMessage };
    }
  }

  private migrateItem(item: MenuItemDocument): boolean {
    let changed = false;

    const migratedName = MigrationValueConverter.toLocalizedString(item.name);
    if (JSON.stringify(item.name) !== JSON.stringify(migratedName)) {
      item.name = migratedName;
      changed = true;
    }

    const migratedDescription = MigrationValueConverter.toLocalizedString(item.description);
    if (JSON.stringify(item.description) !== JSON.stringify(migratedDescription)) {
      item.description = migratedDescription;
      changed = true;
    }

    if (item.customFields && item.customFields.length > 0) {
      for (const field of item.customFields) {
        const migratedFieldName = MigrationValueConverter.toLocalizedString(field.name);
        if (JSON.stringify(field.name) !== JSON.stringify(migratedFieldName)) {
          field.name = migratedFieldName;
          changed = true;
        }

        if (field.options && field.options.length > 0) {
          for (const option of field.options) {
            const migratedOptionLabel = MigrationValueConverter.toLocalizedString(option.label);
            if (JSON.stringify(option.label) !== JSON.stringify(migratedOptionLabel)) {
              option.label = migratedOptionLabel;
              changed = true;
            }
          }
        }
      }
    }

    return changed;
  }
}
