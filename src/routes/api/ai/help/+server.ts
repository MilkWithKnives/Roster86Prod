import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/auth';

export const POST: RequestHandler = async (event) => {
	try {
		// Require authentication
		await requireAuth(event);
		
		const { context } = await event.request.json();

		const help = getContextualHelp(context);

		return json({
			type: 'success',
			data: { help }
		});

	} catch (error) {
		console.error('AI Help API Error:', error);
		return json({
			type: 'error',
			error: 'Failed to get help'
		}, { status: 500 });
	}
};

function getContextualHelp(context: any): string {
	switch (context.currentPage) {
		case 'schedule':
			return `## 📅 Schedule Management

This is your main scheduling hub where you can view, create, and manage shifts.

**Key Features:**
- **Calendar View**: See all shifts in a visual calendar format
- **Create Shifts**: Click on time slots to create new shifts
- **Auto-Scheduler**: Use AI to automatically assign employees to shifts
- **Drag & Drop**: Move shifts around easily
- **Filters**: View specific employees, locations, or roles

**Quick Actions:**
- Click the "+" button to create a new shift
- Use the "Auto Schedule" button for intelligent assignments
- Right-click shifts for quick edit options
- Use the date picker to navigate weeks

**Pro Tips:**
- Color coding shows different shift types and statuses
- Unassigned shifts appear in gray
- Conflicts are highlighted in red`;

		case 'employees':
			return `## 👥 Employee Management

Manage your team members, their skills, availability, and preferences.

**Key Features:**
- **Employee Profiles**: Complete information for each team member
- **Skills Tracking**: Manage certifications and capabilities
- **Availability**: Set when employees can work
- **Preferences**: Location and shift type preferences
- **Role Management**: Assign roles and permissions

**Quick Actions:**
- Click "Add Employee" to onboard new team members
- Edit profiles by clicking on employee cards
- Bulk import employees from CSV files
- Set availability patterns for recurring schedules

**Pro Tips:**
- Keep skills updated for better auto-scheduling
- Regular availability updates improve schedule quality
- Use employee preferences to boost satisfaction`;

		case 'reports':
			return `## 📊 Reports & Analytics

View comprehensive analytics about your scheduling performance.

**Available Reports:**
- **Coverage Analysis**: How well shifts are filled
- **Employee Utilization**: Hours and efficiency metrics
- **Cost Analysis**: Labor costs and budget tracking
- **Fairness Metrics**: Equitable distribution of shifts
- **Compliance Reports**: Labor law adherence

**Key Metrics:**
- Coverage rate, overtime hours, labor costs
- Employee satisfaction and fairness scores
- Schedule efficiency and optimization metrics

**Pro Tips:**
- Review reports weekly for continuous improvement
- Use trends to predict future scheduling needs
- Export data for external analysis`;

		case 'settings':
			return `## ⚙️ System Settings

Configure your scheduling system to match your organization's needs.

**Configuration Areas:**
- **Constraints**: Set scheduling rules and limitations
- **Solver Options**: Choose between different scheduling algorithms
- **Labor Laws**: Configure compliance requirements
- **Notifications**: Set up alerts and reminders
- **Integrations**: Connect with other systems

**Important Settings:**
- Maximum hours per week/day
- Minimum rest periods between shifts
- Overtime thresholds and rules
- Fairness and preference weights

**Pro Tips:**
- Start with default settings and adjust gradually
- Test changes with small schedules first
- Document your organization's specific requirements`;

		case 'availability':
			return `## 🕐 Availability Management

Set when you're available to work and manage your schedule preferences.

**Features:**
- **Weekly Patterns**: Set recurring availability
- **Specific Dates**: Override patterns for specific days
- **Time-Off Requests**: Request vacation or personal time
- **Shift Preferences**: Indicate preferred shift types
- **Location Preferences**: Choose preferred work locations

**How It Works:**
- Green = Available, Red = Unavailable, Yellow = Preferred
- The system uses your availability for auto-scheduling
- Managers can see your availability when creating schedules

**Pro Tips:**
- Keep availability updated for accurate scheduling
- Set preferences to get shifts you prefer
- Submit time-off requests early for better approval chances`;

		default:
			return `## 🚀 Welcome to the Scheduling System

This comprehensive workforce scheduling platform helps you manage shifts, employees, and optimize your schedule.

**Main Features:**
- **Smart Scheduling**: AI-powered automatic shift assignments
- **Employee Management**: Complete team member profiles and availability
- **Real-time Updates**: Live schedule changes and notifications
- **Analytics**: Detailed reports on scheduling performance
- **Mobile Friendly**: Access from any device

**Getting Started:**
1. Set up your employees and their availability
2. Create shifts for your locations and roles
3. Use the auto-scheduler for optimal assignments
4. Monitor performance with reports and analytics

**Need Help?**
- Use this AI assistant for specific questions
- Check the documentation for detailed guides
- Contact support for technical issues`;
	}
}
