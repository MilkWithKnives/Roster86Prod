#!/usr/bin/env node

/**
 * Test script to verify database connection and check existing users
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
    console.log('🔍 Testing database connection and checking users...\n');

    try {
        // Test database connection
        console.log('1️⃣ Testing database connection...');
        await prisma.$connect();
        console.log('✅ Database connection successful');

        // Check existing organizations
        console.log('\n2️⃣ Checking existing organizations...');
        const organizations = await prisma.organization.findMany({
            include: {
                _count: {
                    select: {
                        User: true,
                        Location: true
                    }
                }
            }
        });

        if (organizations.length > 0) {
            console.log(`✅ Found ${organizations.length} organization(s):`);
            organizations.forEach((org, index) => {
                console.log(`  ${index + 1}. ${org.name} (ID: ${org.id})`);
                console.log(`     Users: ${org._count.User}, Locations: ${org._count.Location}`);
                console.log(`     Plan: ${org.plan}, Created: ${org.createdAt.toISOString()}`);
            });
        } else {
            console.log('❌ No organizations found');
        }

        // Check existing users
        console.log('\n3️⃣ Checking existing users...');
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                Organization: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (users.length > 0) {
            console.log(`✅ Found ${users.length} user(s):`);
            users.forEach((user, index) => {
                console.log(`  ${index + 1}. ${user.email} (${user.name})`);
                console.log(`     Role: ${user.role}, Verified: ${user.emailVerified}`);
                console.log(`     Organization: ${user.Organization?.name || 'None'}`);
                console.log(`     Created: ${user.createdAt.toISOString()}`);
            });
        } else {
            console.log('❌ No users found');
        }

        // Check verification tokens
        console.log('\n4️⃣ Checking verification tokens...');
        const tokens = await prisma.verification_tokens.findMany({
            orderBy: {
                expires: 'desc'
            },
            take: 5
        });

        if (tokens.length > 0) {
            console.log(`✅ Found ${tokens.length} recent verification token(s):`);
            tokens.forEach((token, index) => {
                const isExpired = token.expires < new Date();
                console.log(`  ${index + 1}. ${token.identifier}`);
                console.log(`     Token: ${token.token.substring(0, 20)}...`);
                console.log(`     Expires: ${token.expires.toISOString()} ${isExpired ? '(EXPIRED)' : '(VALID)'}`);
            });
        } else {
            console.log('ℹ️ No verification tokens found');
        }

        // Test creating a verification URL to see if PUBLIC_APP_URL is working
        console.log('\n5️⃣ Testing PUBLIC_APP_URL environment variable...');
        const { PUBLIC_APP_URL } = process.env;
        console.log(`PUBLIC_APP_URL: ${PUBLIC_APP_URL || 'undefined'}`);
        
        if (PUBLIC_APP_URL) {
            const testToken = 'test-token-123';
            const verificationUrl = `${PUBLIC_APP_URL}/auth/verify-email?token=${testToken}`;
            console.log(`✅ Test verification URL: ${verificationUrl}`);
        } else {
            console.log('❌ PUBLIC_APP_URL is not set');
        }

    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        console.error('Full error:', error);
    } finally {
        await prisma.$disconnect();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the test
testDatabase().then(() => {
    console.log('\n🏁 Database test completed');
}).catch(error => {
    console.error('💥 Test crashed:', error);
});
