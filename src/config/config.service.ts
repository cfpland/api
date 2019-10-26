import { Injectable } from '@nestjs/common';

interface ConfigObject {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private envConfig: ConfigObject;
  private defaultConfig: ConfigObject = {
    MC_ACCOUNT_ID: '',
    MC_LIST_ID: '',
    MC_LIST_BASE_URL: '',
    AT_API_KEY: '',
    AT_BASE_ID: '',
    MOONCLERK_BASE_URL: 'https://api.moonclerk.com',
    MOONCLERK_API_TOKEN: '',
    MOONCLERK_PRO_FORM_ID: '',
    MICROLINK_BASE_URL: 'https://api.microlink.io/',
    GEONAMES_BASE_URL: 'http://api.geonames.org/searchJSON',
    GEONAMES_USERNAME: '',
    RESTCOUNTRIES_BASE_URL: 'https://restcountries.eu/rest/v2',
    POST_FEED_URL: '',
    SG_API_KEY: '',
  };

  constructor(private readonly envInput: ConfigObject) {
    this.setEnvConfig(envInput);
  }

  public get(key: string): string {
    return this.envConfig[key];
  }

  private setEnvConfig(envInput: ConfigObject): void {
    this.envConfig = { ...this.defaultConfig, ...envInput };
  }
}
