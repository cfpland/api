import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/api/auth/auth.service';
import * as faker from 'faker';
import { loadFixtures } from '../helpers/load-fixtures.function';
import { Connection } from 'typeorm';

describe('Searches (/v0/me/searches)', () => {
    let app;
    let savedFixtures = [];
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

    it('can GET their saved searches', async () => {
        const response = await request(app.getHttpServer())
        .get('/v0/me/searches')
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.total).toEqual(1);
    });

    it('can PUT new saved search', async () => {
        const response = await request(app.getHttpServer())
        .put('/v0/me/searches')
        .send({
            options: {
                category: 'general',
                region: 'americas',
            },
        })
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.id).not.toBeNull();
    });

    it('can DELETE saved search', async () => {
        const search = savedFixtures.find(fixture =>
            fixture.Search !== undefined &&
            fixture.Search.id !== undefined &&
            fixture.Search.user.id === testUserId,
        );

        const deleteResponse = await request(app.getHttpServer())
        .del(`/v0/me/searches/${search.Search.id}`)
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(deleteResponse.body).not.toBeNull();
        expect(deleteResponse.body.affected).toEqual(1);
    });

    afterAll(async () => {
        await app.close();
    });
});
