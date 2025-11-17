import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env file
function loadEnvFile() {
  try {
    const envFile = readFileSync('.env', 'utf8');
    const envVars = {};
    
    envFile.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=');
          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          envVars[key] = value;
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env file:', error.message);
    return {};
  }
}

// Start the production server
function startServer() {
  console.log('Loading environment variables...');
  const envVars = loadEnvFile();
  
  console.log('Environment variables loaded:');
  Object.keys(envVars).forEach(key => {
    if (key.includes('SECRET') || key.includes('PASSWORD')) {
      console.log(`  ${key}=***HIDDEN***`);
    } else {
      console.log(`  ${key}=${envVars[key]}`);
    }
  });
  
  console.log('\nStarting production server...');
  
  const serverProcess = spawn('node', ['build/index.js'], {
    env: { ...process.env, ...envVars },
    stdio: 'inherit'
  });
  
  serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error);
  });
  
  serverProcess.on('exit', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    serverProcess.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\nShutting down server...');
    serverProcess.kill('SIGTERM');
  });
}

startServer();
