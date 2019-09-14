import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/api/auth/auth.service';
import * as faker from 'faker';
import { loadFixtures } from '../helpers/load-fixtures.function';
import { Connection } from 'typeorm';

describe('SavedConferences (/v0/me/saved-conferences)', () => {
    let app;
    let savedFixtures;
    const testUserId = 'e34b5cf4-458b-45ec-a413-8c462f2ef09c';
    const mockAuthService = {
        verify: () => Promise.resolve({id: testUserId}),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
        .overrideProvider(AuthService)
        .useValue(mockAuthService)
        .compile();

        const dbConnection = moduleFixture.get(Connection);
        savedFixtures = await loadFixtures('all-data', dbConnection);

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('can GET their saved-conferences', async () => {
        const response = await request(app.getHttpServer())
        .get('/v0/me/saved-conferences')
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.total).toEqual(2);
    });

    it('can PUT saved-conferences', async () => {
        const airtableId = 'recU9Hdfi0wh40qbc';
        const response = await request(app.getHttpServer())
        .put(`/v0/me/saved-conferences/${airtableId}`)
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.atConferenceId).toEqual(airtableId);
    });

    it('can DELETE saved-conferences', async () => {
        const userConference = savedFixtures.find(fixture =>
            fixture.UserConference !== undefined &&
            fixture.UserConference.user.id === testUserId,
        );

        const response = await request(app.getHttpServer())
        .del(`/v0/me/saved-conferences/${userConference.UserConference.atConferenceId}`)
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(204);

        expect(response.body).not.toBeNull();
    });

    afterAll(async () => {
        await app.close();
    });
});
