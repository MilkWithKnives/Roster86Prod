import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
	console.log('👤 Creating test user for authentication testing...\n');

	try {
		// Get the existing organization
		const organization = await prisma.organization.findFirst();
		
		if (!organization) {
			console.log('❌ No organization found. Please run seed script first.');
			return;
		}

		console.log('✅ Found organization:', organization.name);

		// Delete existing test user if exists
		await prisma.user.deleteMany({
			where: { email: 'testuser@example.com' }
		});

		// Create new test user with known password
		const password = 'password123';
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email: 'testuser@example.com',
				name: 'Test User',
				password: hashedPassword,
				role: 'OWNER',
				organizationId: organization.id,
				emailVerified: true
			}
		});

		console.log('✅ Test user created successfully:');
		console.log('   Email:', user.email);
		console.log('   Password:', password);
		console.log('   Role:', user.role);

		// Verify the password works
		const isValid = await bcrypt.compare(password, user.password!);
		console.log('   Password verification:', isValid ? '✅ Success' : '❌ Failed');

		console.log('\n🚀 You can now test login with:');
		console.log('   Email: testuser@example.com');
		console.log('   Password: password123');

	} catch (error) {
		console.error('💥 Error creating test user:', error);
	} finally {
		await prisma.$disconnect();
	}
}

createTestUser();
