import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
    console.log('🔍 Checking database for scheduling data...\n');
    
    try {
        // Check employees
        const employees = await prisma.user.findMany({
            where: {
                role: {
                    in: ['EMPLOYEE', 'MANAGER', 'OWNER']
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                organizationId: true
            }
        });

        console.log(`👥 Found ${employees.length} employees:`);
        employees.forEach((emp, i) => {
            console.log(`   ${i + 1}. ${emp.name} (${emp.email}) - ${emp.role}`);
        });

        // Check locations
        const locations = await prisma.location.findMany({
            select: {
                id: true,
                name: true,
                address: true
            }
        });

        console.log(`\n📍 Found ${locations.length} locations:`);
        locations.forEach((loc, i) => {
            console.log(`   ${i + 1}. ${loc.name} - ${loc.address}`);
        });

        // Check shifts
        const shifts = await prisma.shift.findMany({
            select: {
                id: true,
                startTime: true,
                endTime: true,
                role: true,
                Location: {
                    select: {
                        name: true
                    }
                },
                User: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                startTime: 'desc'
            },
            take: 10
        });

        console.log(`\n📅 Found ${shifts.length} recent shifts:`);
        shifts.forEach((shift, i) => {
            const startDate = new Date(shift.startTime).toLocaleDateString();
            const startTime = new Date(shift.startTime).toLocaleTimeString();
            const endTime = new Date(shift.endTime).toLocaleTimeString();
            console.log(`   ${i + 1}. ${startDate} ${startTime}-${endTime} at ${shift.Location?.name} (${shift.role}) - ${shift.User?.name || 'Unassigned'}`);
        });

        // Check availability
        const availability = await prisma.availability.findMany({
            select: {
                id: true,
                dayOfWeek: true,
                startTime: true,
                endTime: true,
                User: {
                    select: {
                        name: true
                    }
                }
            },
            take: 10
        });

        console.log(`\n⏰ Found ${availability.length} availability records:`);
        availability.forEach((avail, i) => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            console.log(`   ${i + 1}. ${avail.User.name} - ${days[avail.dayOfWeek]} ${avail.startTime}-${avail.endTime}`);
        });

        if (employees.length === 0) {
            console.log('\n⚠️  No employees found! Auto-scheduling needs employees to work.');
        }
        if (locations.length === 0) {
            console.log('\n⚠️  No locations found! Auto-scheduling needs locations.');
        }
        if (availability.length === 0) {
            console.log('\n⚠️  No availability records found! Employees need to set their availability.');
        }

    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
