import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkUsers() {
    console.log('🔍 Checking database users...\n');
    
    try {
        // Get all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                password: true,
                emailVerified: true,
                organizationId: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`📊 Found ${users.length} users in database:`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. User Details:`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Email Verified: ${user.emailVerified}`);
            console.log(`   Organization ID: ${user.organizationId}`);
            console.log(`   Password: ${user.password ? 'HAS_PASSWORD' : 'NO_PASSWORD'}`);
            console.log(`   Created: ${user.createdAt}`);
            
            if (user.password) {
                console.log(`   Password Hash: ${user.password.substring(0, 20)}...`);
            }
        });

        // Also check organizations
        console.log('\n\n🏢 Organizations:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const orgs = await prisma.organization.findMany({
            select: {
                id: true,
                name: true,
                plan: true,
                createdAt: true,
                _count: {
                    select: {
                        User: true
                    }
                }
            }
        });

        orgs.forEach((org, index) => {
            console.log(`\n${index + 1}. Organization:`);
            console.log(`   ID: ${org.id}`);
            console.log(`   Name: ${org.name}`);
            console.log(`   Plan: ${org.plan}`);
            console.log(`   Users: ${org._count.User}`);
            console.log(`   Created: ${org.createdAt}`);
        });

        // Test password verification for first user with password
        const userWithPassword = users.find(u => u.password);
        if (userWithPassword) {
            console.log('\n\n🔐 Testing password verification...');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`Testing user: ${userWithPassword.email}`);
            
            // Try common passwords
            const testPasswords = ['password', '123456', 'admin', 'test', userWithPassword.email.split('@')[0]];
            
            for (const testPassword of testPasswords) {
                try {
                    const isValid = await bcrypt.compare(testPassword, userWithPassword.password);
                    console.log(`   Password "${testPassword}": ${isValid ? '✅ MATCH' : '❌ NO MATCH'}`);
                    if (isValid) break;
                } catch (error) {
                    console.log(`   Password "${testPassword}": ❌ ERROR - ${error.message}`);
                }
            }
        }

    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
