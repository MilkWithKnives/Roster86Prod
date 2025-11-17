import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
    console.log('🔧 Creating test user...\n');
    
    try {
        const email = 'admin@roster86.com';
        const password = 'admin123';
        const name = 'Admin User';
        
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        
        if (existingUser) {
            console.log(`❌ User ${email} already exists. Updating password...`);
            
            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 12);
            
            // Update the existing user's password
            await prisma.user.update({
                where: { email },
                data: { 
                    password: hashedPassword,
                    emailVerified: true
                }
            });
            
            console.log(`✅ Updated password for ${email}`);
            console.log(`📧 Email: ${email}`);
            console.log(`🔑 Password: ${password}`);
            
        } else {
            console.log(`✅ Creating new user ${email}...`);
            
            // Get the first organization
            const organization = await prisma.organization.findFirst();
            
            if (!organization) {
                console.log('❌ No organization found. Creating one...');
                const newOrg = await prisma.organization.create({
                    data: {
                        name: 'Roster86 Admin',
                        plan: 'free'
                    }
                });
                console.log(`✅ Created organization: ${newOrg.name}`);
            }
            
            const orgToUse = organization || await prisma.organization.findFirst();
            
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 12);
            
            // Create the user
            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'OWNER',
                    organizationId: orgToUse.id,
                    emailVerified: true
                }
            });
            
            console.log(`✅ Created user: ${user.email}`);
            console.log(`📧 Email: ${email}`);
            console.log(`🔑 Password: ${password}`);
        }
        
        // Test the password
        console.log('\n🧪 Testing password...');
        const user = await prisma.user.findUnique({
            where: { email }
        });
        
        const isValid = await bcrypt.compare(password, user.password);
        console.log(`Password verification: ${isValid ? '✅ SUCCESS' : '❌ FAILED'}`);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser();
