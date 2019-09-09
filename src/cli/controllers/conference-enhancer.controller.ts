import { Controller, Logger } from '@nestjs/common';
import { ConferenceDto } from '../../data-access/conferences/dtos/conference.dto';
import { ConferencesService } from '../../data-access/conferences/services/conferences.service';
import { ConfigService } from '../../config/config.service';
import { ConferenceEnhancementsService } from '../../data-access/conference-enhancements/conference-enhancements.service';

@Controller('enhancer')
export class ConferenceEnhancerController {
  constructor(
    private readonly conferenceEnhancementService: ConferenceEnhancementsService,
    private readonly conferencesService: ConferencesService,
    private readonly config: ConfigService,
  ) {}

  public async addEnhancedDataToConferences(): Promise<ConferenceDto[]> {
    const savedConferences = [];
    try {
      // Get new conferences with no country
      const conferences = await this.conferencesService.getInternal({
        atView: '_new_not_enhanced',
      });
      Logger.log(`${conferences.total} conferences found to be enhanced`);
      let count = 0;

      for (const conference of conferences.items) {
        try {
          // Get the enhanced data
          const enhancedConference = await this.conferenceEnhancementService
            .getOneById(conference.event_url)
            .toPromise();

          const partialConference = {
            providerId: conference.providerId,
            description: enhancedConference.description,
            icon: [{ url: enhancedConference.icon }],
          } as Partial<ConferenceDto>;

          if (this.config.get('SAVE') === 'all') {
            // Save conference
            savedConferences.push(
              await this.conferencesService.update(partialConference),
            );
            count++;
          }
        } catch (e) {
          Logger.error(e.message);
        }
      }

      Logger.log(`${count} conferences enhanced`);
    } catch (e) {
      Logger.error(e.message);
    }

    return savedConferences;
  }
}
