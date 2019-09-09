import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/api/auth/auth.service';
import * as faker from 'faker';
import { loadFixtures } from '../helpers/load-fixtures.function';
import { Connection } from 'typeorm';

describe('UserConferences (/v0/me/conferences)', () => {
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

    it('can GET their user-conferences', async () => {
        const response = await request(app.getHttpServer())
        .get('/v0/me/conferences')
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.total).toEqual(5);
    });

    it('can PUT hide user-conference', async () => {
        const airtableId = 'recU9Hdfi0wh40qbc';
        const action = 'hide';
        const response = await request(app.getHttpServer())
        .put(`/v0/me/conferences/${airtableId}/${action}`)
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.atConferenceId).toEqual(airtableId);
        expect(response.body.action).toEqual(action);
    });

    it('can PUT save user-conference', async () => {
        const airtableId = 'recU9Hdfi0wh40qbc';
        const action = 'save';
        const response = await request(app.getHttpServer())
        .put(`/v0/me/conferences/${airtableId}/${action}`)
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.atConferenceId).toEqual(airtableId);
        expect(response.body.action).toEqual(action);
    });

    it('can DELETE user-conference', async () => {
        const userConference = savedFixtures.find(fixture =>
            fixture.UserConference !== undefined &&
            fixture.UserConference.user.id === testUserId,
        );

        const response = await request(app.getHttpServer())
        .del(`/v0/me/conferences/${userConference.UserConference.atConferenceId}/${userConference.UserConference.action}`)
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.affected).toEqual(1);
    });

    afterAll(async () => {
        await app.close();
    });
});
