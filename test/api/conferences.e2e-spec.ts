import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { Category } from '../../src/shared/types/category';
import { AuthService } from '../../src/api/auth/auth.service';
import * as faker from 'faker';

describe('Conferences (/v0/conferences)', () => {
    let app;

    describe('unauthenticated users', () => {
        beforeEach(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({
                imports: [AppModule],
            }).compile();

            app = moduleFixture.createNestApplication();
            await app.init();
        });

        it('can GET all without options', async () => {
            const response = await request(app.getHttpServer())
            .get('/v0/conferences')
            .expect(200)
            .expect('Content-Type', /json/);

            expect(response.body).not.toBeNull();
            expect(response.body.items).not.toBeNull();
            expect(response.body.total).toBeGreaterThan(0);
        });

        it('can GET all by category', async () => {
            const category: Category = 'General';
            const response = await request(app.getHttpServer())
            .get(`/v0/conferences?category=${category}`)
            .expect(200)
            .expect('Content-Type', /json/);

            expect(response.body).not.toBeNull();
            if (response.body.total > 0) {
                response.body.items.forEach(item => {
                    expect(item.category).toBe(category);
                });
            }
        });
    });

    describe('authenticated users', () => {
        const mockAuthService = {
            verify: () => Promise.resolve({id: faker.random.uuid()}),
        };

        beforeEach(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({
                imports: [AppModule],
            })
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

            app = moduleFixture.createNestApplication();
            await app.init();
        });

        it('can GET all by airtable ID', async () => {
            const airtableId = 'recU9Hdfi0wh40qbc';
            const response = await request(app.getHttpServer())
            .get(`/v0/conferences?atIds[]=${airtableId}`)
            .set('Authorization', `Bearer ${faker.random.alphaNumeric(12)}`)
            .expect(200)
            .expect('Content-Type', /json/);

            expect(response.body).not.toBeNull();
            expect(response.body.total).toEqual(1);
            response.body.items.forEach(item => {
                expect(item.providerId).toBe(airtableId);
            });
        });
    });

    afterAll(async () => {
        await app.close();
    });

});
