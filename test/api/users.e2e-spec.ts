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

    it('can GET their own account', async () => {
        const response = await request(app.getHttpServer())
        .get('/v0/me')
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.id).toEqual(testUserId);
    });

    it('can POST new user account', async () => {
        const newUser = {
            email: faker.internet.exampleEmail(),
            auth0UserId: faker.random.alphaNumeric(12),
        };
        const response = await request(app.getHttpServer())
        .post('/v0/users')
        .send(newUser)
        .set('Authorization', `Bearer ${process.env.AUTH0_CREATE_USER_KEY}`)
        .expect(201)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.id).not.toBeNull();
        expect(response.body.email).toBe(newUser.email);
        expect(response.body.auth0UserId).toBe(newUser.auth0UserId);
        // Make sure the user is given a free account by default
        expect(response.body.userAccounts.length).toBe(1);
        expect(response.body.userAccounts[0].role).toBe('owner');
        expect(response.body.userAccounts[0].account.type).toBe('free');
    });

    afterAll(async () => {
        await app.close();
    });
});
