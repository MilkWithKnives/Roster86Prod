#!/usr/bin/env python3
"""
Custom MCP Server for SvelteKit Deployment Debugging
Specifically designed for your roster86.com deployment issues
"""

import json
import subprocess
import sys
import os
from typing import Dict, List, Any

class DeploymentDebugger:
    def __init__(self):
        self.issues = []
        self.fixes = []
    
    def check_pm2_status(self) -> Dict[str, Any]:
        """Check PM2 process status"""
        try:
            result = subprocess.run(['pm2', 'jlist'], capture_output=True, text=True)
            if result.returncode == 0:
                processes = json.loads(result.stdout)
                return {
                    "status": "success",
                    "processes": processes,
                    "running_count": len([p for p in processes if p.get('pm2_env', {}).get('status') == 'online'])
                }
        except Exception as e:
            return {"status": "error", "error": str(e)}
    
    def check_nginx_status(self) -> Dict[str, Any]:
        """Check Nginx configuration and status"""
        try:
            # Test nginx config
            config_test = subprocess.run(['nginx', '-t'], capture_output=True, text=True)
            
            # Check if nginx is running
            status_check = subprocess.run(['systemctl', 'is-active', 'nginx'], capture_output=True, text=True)
            
            return {
                "config_valid": config_test.returncode == 0,
                "config_errors": config_test.stderr if config_test.returncode != 0 else None,
                "service_active": status_check.stdout.strip() == 'active'
            }
        except Exception as e:
            return {"status": "error", "error": str(e)}
    
    def check_build_issues(self) -> Dict[str, Any]:
        """Check for common SvelteKit build issues"""
        issues = []
        
        # Check for ES module issues
        if os.path.exists('build/server'):
            for root, dirs, files in os.walk('build/server'):
                for file in files:
                    if file.endswith('.js'):
                        filepath = os.path.join(root, file)
                        try:
                            with open(filepath, 'r') as f:
                                content = f.read()
                                if '__dirname' in content and 'type": "module"' in open('package.json').read():
                                    issues.append({
                                        "type": "es_module_issue",
                                        "file": filepath,
                                        "description": "ES module using __dirname"
                                    })
                        except:
                            pass
        
        return {"issues": issues}
    
    def get_deployment_fixes(self) -> List[Dict[str, Any]]:
        """Get specific fixes for your deployment issues"""
        fixes = [
            {
                "issue": "Prisma __dirname ES module error",
                "fix": "Add NODE_OPTIONS='--experimental-specifier-resolution=node' to ecosystem.config.cjs",
                "command": "Update ecosystem.config.cjs env section",
                "priority": "high"
            },
            {
                "issue": "Auth.js getSession not a function",
                "fix": "Update to use event.locals.auth() instead of getSession()",
                "command": "Check hooks.server.ts and auth configuration",
                "priority": "high"
            },
            {
                "issue": "PM2 processes stopped",
                "fix": "Restart PM2 with proper configuration",
                "command": "pm2 restart ecosystem.config.cjs",
                "priority": "critical"
            },
            {
                "issue": "502 Bad Gateway",
                "fix": "Ensure PM2 is running and Nginx proxy is correct",
                "command": "Check PM2 status and Nginx upstream configuration",
                "priority": "critical"
            }
        ]
        return fixes
    
    def run_full_diagnosis(self) -> Dict[str, Any]:
        """Run complete deployment diagnosis"""
        diagnosis = {
            "pm2": self.check_pm2_status(),
            "nginx": self.check_nginx_status(),
            "build": self.check_build_issues(),
            "fixes": self.get_deployment_fixes()
        }
        
        return diagnosis

def main():
    """Main MCP server function"""
    debugger = DeploymentDebugger()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "diagnose":
            result = debugger.run_full_diagnosis()
            print(json.dumps(result, indent=2))
        elif command == "pm2":
            result = debugger.check_pm2_status()
            print(json.dumps(result, indent=2))
        elif command == "nginx":
            result = debugger.check_nginx_status()
            print(json.dumps(result, indent=2))
        elif command == "fixes":
            result = debugger.get_deployment_fixes()
            print(json.dumps(result, indent=2))
    else:
        print("Usage: python debug-deployment-mcp.py [diagnose|pm2|nginx|fixes]")

if __name__ == "__main__":
    main()
