#!/usr/bin/env node

/**
 * Test script to verify location addition functionality
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testLocationFunctionality() {
    console.log('🏢 Testing location functionality...\n');

    try {
        // Test database connection
        console.log('1️⃣ Testing database connection...');
        await prisma.$connect();
        console.log('✅ Database connection successful');

        // Find an organization to test with
        console.log('\n2️⃣ Finding organization to test with...');
        const organization = await prisma.organization.findFirst({
            include: {
                User: {
                    where: {
                        role: {
                            in: ['OWNER', 'MANAGER']
                        }
                    },
                    take: 1
                },
                Location: true
            }
        });

        if (!organization) {
            console.log('❌ No organization found for testing');
            return;
        }

        console.log(`✅ Using organization: ${organization.name} (ID: ${organization.id})`);
        console.log(`   Current locations: ${organization.Location.length}`);
        
        if (organization.User.length > 0) {
            console.log(`   Test user: ${organization.User[0].email} (${organization.User[0].role})`);
        }

        // Test creating a new location
        console.log('\n3️⃣ Testing location creation...');

        // Generate a unique ID for the location (similar to how Prisma generates cuid)
        const generateId = () => {
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < 25; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        const testLocation = {
            id: generateId(),
            name: `Test Location ${Date.now()}`,
            address: '123 Test Street, Test City, TC 12345',
            latitude: 40.7128,
            longitude: -74.0060,
            geofenceRadius: 250,
            organizationId: organization.id
        };

        const newLocation = await prisma.location.create({
            data: testLocation
        });

        console.log('✅ Location created successfully:');
        console.log(`   Name: ${newLocation.name}`);
        console.log(`   Address: ${newLocation.address}`);
        console.log(`   Coordinates: ${newLocation.latitude}, ${newLocation.longitude}`);
        console.log(`   Geofence Radius: ${newLocation.geofenceRadius}m`);
        console.log(`   ID: ${newLocation.id}`);

        // Test updating the location
        console.log('\n4️⃣ Testing location update...');
        const updatedLocation = await prisma.location.update({
            where: { id: newLocation.id },
            data: {
                name: `${newLocation.name} (Updated)`,
                geofenceRadius: 300
            }
        });

        console.log('✅ Location updated successfully:');
        console.log(`   New name: ${updatedLocation.name}`);
        console.log(`   New geofence radius: ${updatedLocation.geofenceRadius}m`);

        // Test querying locations for the organization
        console.log('\n5️⃣ Testing location queries...');
        const allLocations = await prisma.location.findMany({
            where: {
                organizationId: organization.id
            },
            include: {
                _count: {
                    select: {
                        Shift: true,
                        User: true
                    }
                }
            }
        });

        console.log(`✅ Found ${allLocations.length} location(s) for organization:`);
        allLocations.forEach((location, index) => {
            console.log(`   ${index + 1}. ${location.name}`);
            console.log(`      Address: ${location.address}`);
            console.log(`      Shifts: ${location._count.Shift}, Preferred by: ${location._count.User} users`);
        });

        // Clean up - delete the test location
        console.log('\n6️⃣ Cleaning up test location...');
        await prisma.location.delete({
            where: { id: newLocation.id }
        });
        console.log('✅ Test location deleted successfully');

        // Test location-related constraints
        console.log('\n7️⃣ Testing location constraints...');
        
        // Test that location requires organization
        try {
            await prisma.location.create({
                data: {
                    name: 'Invalid Location',
                    address: 'No Organization',
                    organizationId: 'invalid-id'
                }
            });
            console.log('❌ Should have failed with invalid organization ID');
        } catch (error) {
            console.log('✅ Correctly rejected invalid organization ID');
        }

    } catch (error) {
        console.error('❌ Location test failed:', error.message);
        console.error('Full error:', error);
    } finally {
        await prisma.$disconnect();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the test
testLocationFunctionality().then(() => {
    console.log('\n🏁 Location functionality test completed');
}).catch(error => {
    console.error('💥 Test crashed:', error);
});
