import { Controller, Logger } from '@nestjs/common';
import { ConferencesService } from '../../data-access/conferences/services/conferences.service';
import { ConferenceDto } from '../../data-access/conferences/dtos/conference.dto';
import { ConfigService } from '../../config/config.service';
import { Collection } from '../../data-access/interfaces/collection.interface';

@Controller()
export class ConferenceCollectorController {
  constructor(
    private readonly conferences: ConferencesService,
    private readonly config: ConfigService,
  ) {}

  public async collectNewConferences(): Promise<ConferenceDto[]> {
    let savedConferences = [];
    try {
      const newConferences = await this.conferences.allNewExternal();
      Logger.log(`${newConferences.total} new conferences found.`);

      const saveabledConferences = this.getSaveableConferences(newConferences);

      savedConferences = (await this.conferences.createMany(
        saveabledConferences,
      )).items;
      Logger.log(`${savedConferences.length} new conferences saved.`);
    } catch (e) {
      Logger.error(e.message);
    }

    return savedConferences;
  }

  private getSaveableConferences(
    conferences: Collection<ConferenceDto>,
  ): Collection<ConferenceDto> {
    let saveableConferences = {
      items: [],
      total: 0,
    };

    if (this.config.get('SAVE') === 'all') {
      saveableConferences = { ...conferences };
      Logger.log('Saving all new conferences.');
    } else if (this.config.get('SAVE') !== undefined) {
      saveableConferences.items = conferences.items.slice(
        0,
        Number(this.config.get('SAVE')),
      );
      saveableConferences.total = saveableConferences.items.length;
      Logger.log(`Saving ${Number(this.config.get('SAVE'))} new conferences.`);
    } else {
      Logger.log('Saving no new conferences.');
    }

    return saveableConferences;
  }
}
