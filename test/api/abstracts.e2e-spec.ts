import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/api/auth/auth.service';
import * as faker from 'faker';
import { loadFixtures } from '../helpers/load-fixtures.function';
import { Connection } from 'typeorm';

describe('Abstracts (/v0/me/abstracts)', () => {
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

    it('can GET their abstracts', async () => {
        const response = await request(app.getHttpServer())
        .get('/v0/me/abstracts')
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.total).toEqual(2);
    });

    it('can POST new abstract', async () => {
        const response = await request(app.getHttpServer())
        .post('/v0/me/abstracts')
        .send({
            title: 'This is my title',
            description: 'This is a longer description',
        })
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(201)
        .expect('Content-Type', /json/);

        expect(response.body).not.toBeNull();
        expect(response.body.id).not.toBeNull();
    });

    it('can DELETE their own abstract', async () => {
        const abstractEntity = savedFixtures.find(fixture =>
          fixture.AbstractEntity !== undefined &&
          fixture.AbstractEntity.id !== undefined &&
          fixture.AbstractEntity.user.id === testUserId,
        );

        const deleteResponse = await request(app.getHttpServer())
        .del(`/v0/me/abstracts/${abstractEntity.AbstractEntity.id}`)
        .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
        .expect(204);
    });

    it('cannot DELETE another user\'s abstract', async () => {
        const abstractEntity = savedFixtures.find(fixture =>
            fixture.AbstractEntity !== undefined &&
            fixture.AbstractEntity.id !== undefined &&
            fixture.AbstractEntity.user.id !== testUserId,
        );

        const deleteResponse = await request(app.getHttpServer())
            .del(`/v0/me/abstracts/${abstractEntity.AbstractEntity.id}`)
            .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
            .expect(403);
    });

    afterAll(async () => {
        await app.close();
    });
});
