# Configuration

This folder will be populated by `/Start_Project` based on your tech stack choices.

## Generated Files

After running `/Start_Project`, this folder will contain:

- **environment.ts** - Environment variables and API endpoints
- **constants.ts** - Application constants and configuration values

## Usage

```typescript
// Import environment config
import { ENV } from '../Config/environment';

// Import constants
import { APP, LIMITS } from '../Config/constants';
```

## Note

Do not manually create these files. Run `/Start_Project` to generate them with proper values for your project.
