import { Connection } from 'typeorm';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

export async function loadFixtures(name: string, dbConnection: Connection): Promise<any[]> {
    // Reset the database
    await dbConnection.dropDatabase();
    await dbConnection.synchronize();

    let items = [];
    try {
        const file: any = yaml.safeLoad(fs.readFileSync(`./test/fixtures/${name}.yml`, 'utf8'));
        items = file.fixtures;
    } catch (e) {
        Logger.error('fixtures error', e);
    }

    for (const item of items) {
        const entityName = Object.keys(item)[0];
        const data = item[entityName];

        await dbConnection.createQueryBuilder().insert().into(entityName).values(data).execute();
    }

    return Promise.resolve(items);
}
