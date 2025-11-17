import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleData() {
    console.log('🏗️  Creating sample data for auto-scheduling...\n');
    
    try {
        // Get the first organization
        const organization = await prisma.organization.findFirst();
        if (!organization) {
            console.log('❌ No organization found!');
            return;
        }

        console.log(`📊 Using organization: ${organization.name}`);

        // Create locations
        console.log('\n📍 Creating locations...');
        const locations = await Promise.all([
            prisma.location.create({
                data: {
                    name: 'Main Store',
                    address: '123 Main St, City, State 12345',
                    organizationId: organization.id
                }
            }),
            prisma.location.create({
                data: {
                    name: 'Downtown Branch',
                    address: '456 Downtown Ave, City, State 12345',
                    organizationId: organization.id
                }
            })
        ]);

        locations.forEach((loc, i) => {
            console.log(`   ✅ Created: ${loc.name}`);
        });

        // Create some employees with different roles
        console.log('\n👥 Creating employees...');
        const employeeData = [
            {
                email: 'manager@roster86.com',
                name: 'Sarah Manager',
                role: 'MANAGER',
                organizationId: organization.id,
                maxHoursPerWeek: 40,
                defaultHourlyRate: 25.00,
                emailVerified: true,
                isFullTime: true,
                seniority: 5
            },
            {
                email: 'employee1@roster86.com',
                name: 'John Employee',
                role: 'EMPLOYEE',
                organizationId: organization.id,
                maxHoursPerWeek: 30,
                defaultHourlyRate: 18.00,
                emailVerified: true,
                isFullTime: false,
                seniority: 2
            },
            {
                email: 'employee2@roster86.com',
                name: 'Jane Worker',
                role: 'EMPLOYEE',
                organizationId: organization.id,
                maxHoursPerWeek: 25,
                defaultHourlyRate: 16.50,
                emailVerified: true,
                isFullTime: false,
                seniority: 1
            }
        ];

        const employees = [];
        for (const empData of employeeData) {
            try {
                const employee = await prisma.user.create({ data: empData });
                employees.push(employee);
                console.log(`   ✅ Created: ${employee.name} (${employee.role})`);
            } catch (error) {
                if (error.code === 'P2002') {
                    // User already exists, find them
                    const existingEmployee = await prisma.user.findUnique({
                        where: { email: empData.email }
                    });
                    if (existingEmployee) {
                        employees.push(existingEmployee);
                        console.log(`   ♻️  Using existing: ${existingEmployee.name} (${existingEmployee.role})`);
                    }
                } else {
                    throw error;
                }
            }
        }



        // Create availability for employees
        console.log('\n⏰ Creating availability records...');
        const availabilityData = [
            // Sarah Manager - Available most days
            { userId: employees[0].id, dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
            { userId: employees[0].id, dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
            { userId: employees[0].id, dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
            { userId: employees[0].id, dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
            { userId: employees[0].id, dayOfWeek: 5, startTime: '09:00', endTime: '15:00' }, // Friday
            
            // John Employee - Part-time, evenings and weekends
            { userId: employees[1].id, dayOfWeek: 1, startTime: '17:00', endTime: '22:00' }, // Monday
            { userId: employees[1].id, dayOfWeek: 3, startTime: '17:00', endTime: '22:00' }, // Wednesday
            { userId: employees[1].id, dayOfWeek: 5, startTime: '17:00', endTime: '22:00' }, // Friday
            { userId: employees[1].id, dayOfWeek: 6, startTime: '10:00', endTime: '18:00' }, // Saturday
            { userId: employees[1].id, dayOfWeek: 0, startTime: '12:00', endTime: '20:00' }, // Sunday
            
            // Jane Worker - Mornings and mid-week
            { userId: employees[2].id, dayOfWeek: 2, startTime: '08:00', endTime: '16:00' }, // Tuesday
            { userId: employees[2].id, dayOfWeek: 3, startTime: '08:00', endTime: '16:00' }, // Wednesday
            { userId: employees[2].id, dayOfWeek: 4, startTime: '08:00', endTime: '16:00' }, // Thursday
            { userId: employees[2].id, dayOfWeek: 6, startTime: '09:00', endTime: '15:00' }, // Saturday
        ];

        for (const avail of availabilityData) {
            await prisma.availability.create({ data: avail });
        }

        console.log(`   ✅ Created ${availabilityData.length} availability records`);

        // Create some sample shifts that need to be filled
        console.log('\n📅 Creating sample shifts to schedule...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const shifts = [];
        for (let i = 0; i < 7; i++) { // Create shifts for next 7 days
            const shiftDate = new Date(tomorrow);
            shiftDate.setDate(shiftDate.getDate() + i);
            
            // Morning shift
            const morningStart = new Date(shiftDate);
            morningStart.setHours(9, 0, 0, 0);
            const morningEnd = new Date(shiftDate);
            morningEnd.setHours(17, 0, 0, 0);
            
            shifts.push({
                startTime: morningStart,
                endTime: morningEnd,
                locationId: locations[0].id,
                role: 'CASHIER',
                status: 'PUBLISHED'
            });

            // Evening shift (weekends only)
            if (shiftDate.getDay() === 0 || shiftDate.getDay() === 6) {
                const eveningStart = new Date(shiftDate);
                eveningStart.setHours(17, 0, 0, 0);
                const eveningEnd = new Date(shiftDate);
                eveningEnd.setHours(22, 0, 0, 0);
                
                shifts.push({
                    startTime: eveningStart,
                    endTime: eveningEnd,
                    locationId: locations[1].id,
                    role: 'SALES_ASSOCIATE',
                    status: 'PUBLISHED'
                });
            }
        }

        for (const shift of shifts) {
            await prisma.shift.create({ data: shift });
        }

        console.log(`   ✅ Created ${shifts.length} shifts to be scheduled`);

        console.log('\n🎉 Sample data created successfully!');
        console.log('\n📋 Summary:');
        console.log(`   • ${locations.length} locations`);
        console.log(`   • ${employees.length} employees`);
        console.log(`   • ${availabilityData.length} availability records`);
        console.log(`   • ${shifts.length} open shifts`);
        console.log('\n✨ You can now test the auto-scheduling feature!');

    } catch (error) {
        console.error('❌ Error creating sample data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createSampleData();
