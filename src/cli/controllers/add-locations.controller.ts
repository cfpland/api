import { Controller, Logger } from '@nestjs/common';
import { ConferenceDto } from '../../data-access/conferences/dtos/conference.dto';
import { ConferencesService } from '../../data-access/conferences/services/conferences.service';
import { ConfigService } from '../../config/config.service';
import { LocationsService } from '../../data-access/locations/locations.service';
import { Location } from '../../data-access/locations/interfaces/location.interface';

@Controller('locations')
export class AddLocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly conferencesService: ConferencesService,
    private readonly config: ConfigService,
  ) {}

  public async addLocationsToConferences(): Promise<ConferenceDto[]> {
    const savedConferences = [];
    try {
      // Get new conferences with no country
      const conferences = await this.conferencesService.getInternal({
        atView: '_new_no_country',
      });
      Logger.log(`${conferences.total} conferences without locations found`);
      let count = 0;

      for (const conference of conferences.items) {
        try {
          // Get the location
          const locationObj = await this.getLocation(conference.location);
          const partialConference = {
            providerId: conference.providerId,
            country: locationObj.country.name,
            region: locationObj.region,
            subregion: locationObj.subregion,
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

      Logger.log(`${count} conference locations updated`);
    } catch (e) {
      Logger.error(e.message);
    }

    return savedConferences;
  }

  private getLocation(location: string): Promise<Location> {
    return this.locationsService.getOneById(location).toPromise();
  }
}
