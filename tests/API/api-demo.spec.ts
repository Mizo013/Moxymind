import { test, expect } from '@playwright/test';
import usersData from '../../data/users.json';
import Ajv from 'ajv';


test.describe('API Demo Tests', ()=> {

    const baseUrl = 'https://reqres.in/'; // Base URL for ReqRes mock API
    const ajv = new Ajv(); // JSON Schema validator instance

    /**
     * TC01: GET List Users and Validate Response
     * Tests retrieving a list of users and validates response structure
     * Verifies data types, user count logic, and specific user data
     */
    test('TC01: GET List Users and Validate Response', async ({ request }) => {
        const response = await request.get(`${baseUrl}api/users?page=2`);

        expect(response.status()).toBe(200);
        const responseBody = await response.json();

        // 1. Assert "total" field exists and is a number
        expect(responseBody.total).toBeDefined();
        expect(typeof responseBody.total).toBe('number');

        // 2. Assert "last_name" for the first and second user in the data array
        expect(responseBody.data[0].last_name).toBe('Lawson');
        expect(typeof responseBody.data[0].last_name).toBe('string');
        expect(responseBody.data[1].last_name).toBe('Ferguson');
        expect(typeof responseBody.data[1].last_name).toBe('string');


        // 3. Count users in "data" array and compare to total available users
        // Validates that the page contains users and doesn't exceed total
        const userCount = responseBody.data.length;
        // console.log(`Received ${userCount} users on this page. Total available: ${responseBody.total}`);
        expect(userCount).toBeLessThanOrEqual(responseBody.total);
    });

    /**
     * TC02: POST Create User - Data-driven test
     * Tests user creation endpoint for multiple test users from JSON data file
     * Validates response structure, performance (response time < 1000ms), and JSON schema compliance
     * Uses Ajv for schema validation against expected response format
     */
    for (const user of usersData) {
        test(`TC02: POST Create User - ${user.name}`, async ({ request }) => {
            const startTime = Date.now(); // Start performance measurement

            const response = await request.post(`${baseUrl}api/users`, {data: user});

            const endTime = Date.now();
            const responseTime = endTime - startTime; // Calculate response time

            // 1. Assert successful creation (HTTP 201 Created)
            expect(response.status()).toBe(201);

            const responseBody = await response.json();

            // 2. Assert required fields are present and have correct format
            expect(responseBody.id).toBeDefined(); // Auto-generated ID
            expect(responseBody.createdAt).toBeDefined(); // Timestamp
            expect(responseBody.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/); // ISO 8601 format

            // 3. Performance assertion - response should be under 1000ms
            // console.log(`Response time: ${responseTime}ms`);
            expect(responseTime).toBeLessThan(1000);

            // 4. JSON Schema validation using Ajv
            // Validates response structure matches expected schema
            const userSchema = {
                "type": "object",
                "properties": {
                    "name": {
                    "type": "string"
                    },
                    "job": {
                    "type": "string"
                    },
                    "id": {
                    "type": "string"
                    },
                    "createdAt": {
                    "type": "string",
                    },
                    "_meta": {
                    "type": "object",
                    "properties": {
                        "powered_by": {
                        "type": "string"
                        },
                        "docs_url": {
                        "type": "string"
                        },
                        "upgrade_url": {
                        "type": "string"
                        },
                        "example_url": {
                        "type": "string"
                        },
                        "variant": {
                        "type": "string"
                        },
                        "message": {
                        "type": "string"
                        },
                        "cta": {
                        "type": "object",
                        "properties": {
                            "label": {
                            "type": "string"
                            },
                            "url": {
                            "type": "string"
                            }
                        },
                        "required": [
                            "label",
                            "url"
                        ]
                        },
                        "context": {
                        "type": "string"
                        }
                    },
                    "required": [
                        "powered_by",
                        "docs_url",
                        "upgrade_url",
                        "example_url",
                        "variant",
                        "message",
                        "cta",
                        "context"
                    ]
                    }
                },
                "required": [
                    "name",
                    "job",
                    "id",
                    "createdAt",
                    "_meta"
                ]
            };

            // Validate response against JSON schema
            expect(ajv.validate(userSchema, responseBody)).toBe(true);
        });
    }

});