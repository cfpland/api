import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/api/auth/auth.service';
import * as faker from 'faker';
import { loadFixtures } from '../helpers/load-fixtures.function';
import { Connection } from 'typeorm';

describe('Users (/v0/me)', () => {
    let app;
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
        await loadFixtures('all-data', dbConnection);

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('can GET their account', async () => {
        const response = await request(app.getHttpServer())
        .get('/v0/me')
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.id).toEqual(testUserId);
    });

    afterAll(async () => {
        await app.close();
    });
});
