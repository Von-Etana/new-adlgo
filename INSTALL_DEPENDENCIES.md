# Installation Instructions

Due to PowerShell execution policy restrictions, you'll need to install the new dependencies manually.

## Required Dependencies

Run these commands in your terminal (with execution policy adjusted):

```bash
cd apps/backend
npm install bcrypt @types/bcrypt @nestjs/swagger @nestjs/throttler
```

## If you get PowerShell errors:

### Option 1: Temporary (Recommended)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npm install bcrypt @types/bcrypt @nestjs/swagger @nestjs/throttler
```

### Option 2: Use CMD instead
```cmd
cd apps\backend
npm install bcrypt @types/bcrypt @nestjs/swagger @nestjs/throttler
```

## After Installation

The backend will have all security fixes and improvements applied!
