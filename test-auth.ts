import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuth() {
	console.log('🧪 Testing authentication setup...\n');

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
				organizationId: true
			}
		});

		console.log(`📊 Found ${users.length} users in database:`);
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

		for (const user of users) {
			console.log(`👤 ${user.name} (${user.email})`);
			console.log(`   Role: ${user.role}`);
			console.log(`   Email Verified: ${user.emailVerified}`);
			console.log(`   Has Password: ${user.password ? '✅ Yes' : '❌ No'}`);
			console.log(`   Organization ID: ${user.organizationId}`);

			// Test password verification with known test passwords
			if (user.password) {
				const testPasswords = ['password123', 'password', 'test123', 'admin'];
				for (const testPassword of testPasswords) {
					const isValid = await bcrypt.compare(testPassword, user.password);
					console.log(`   Password Test (${testPassword}): ${isValid ? '✅ Valid' : '❌ Invalid'}`);
					if (isValid) break;
				}
			}
			console.log('');
		}

		// Test specific user lookup (like Auth.js does)
		console.log('🔍 Testing user lookup by email...');
		const testEmail = 'test@example.com'; // Use the actual email from database
		const user = await prisma.user.findUnique({
			where: { email: testEmail },
			include: { Organization: true }
		});

		if (user) {
			console.log(`✅ User found: ${user.name} (${user.email})`);
			console.log(`   Organization: ${user.Organization.name}`);

			if (user.password) {
				const testPasswords = ['password123', 'password', 'test123', 'admin'];
				for (const testPassword of testPasswords) {
					const isValid = await bcrypt.compare(testPassword, user.password);
					console.log(`   Password verification (${testPassword}): ${isValid ? '✅ Success' : '❌ Failed'}`);
					if (isValid) break;
				}
			}
		} else {
			console.log(`❌ User not found: ${testEmail}`);
		}

	} catch (error) {
		console.error('💥 Error testing auth:', error);
	} finally {
		await prisma.$disconnect();
	}
}

testAuth();
