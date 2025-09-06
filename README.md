![Tersa image](/app/opengraph-image.png)

# Tersa

A visual AI playground. Tersa is an open source canvas for building AI workflows. Drag, drop connect and run nodes to build your own workflows powered by various industry-leading AI models.

## Features

- **Visual Workflow Builder**: Create AI workflows by connecting nodes in an intuitive drag-and-drop interface
- **Multiple AI Models**: Seamlessly integrate with leading AI models from various providers
- **Multimedia Processing**: Process images, text, audio, and video content through your workflows
- **Automatic Saving**: Changes are automatically saved to your projects
- **Cloud Storage**: All workflows are securely stored in Supabase with Row Level Security enabled
- **Modern UI**: Clean, responsive interface built with Next.js, React, and Tailwind CSS

## Technologies

- [Next.js 15](https://nextjs.org/) with App Router and Turbopack
- [React 19](https://react.dev/)
- [Supabase](https://supabase.com/) for authentication and data storage
- [Vercel AI SDK](https://sdk.vercel.ai/) for AI model integration
- [ReactFlow](https://reactflow.dev/) for the visual canvas
- [TipTap](https://tiptap.dev/) for rich text editing
- [Drizzle ORM](https://orm.drizzle.team/) for database queries
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/), [Kibo UI](https://www.kibo-ui.com/) and [Radix UI](https://www.radix-ui.com/) for accessible UI components

## Getting Started

### Prerequisites

- Node.js (v20+)
- PNPM package manager
- Supabase account and project
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) installed
- [Stripe CLI](https://docs.stripe.com/stripe-cli) installed

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/haydenbleasel/tersa.git
   cd tersa
   ```

2. Install dependencies
   ```sh
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with your environment variables. Check the `lib/env.ts` file for all the variables you need to set.

   You can copy the `.env.example` file as a starting point:
   ```sh
   cp .env.example .env.local
   ```
   
   Then update the values in `.env.local` with your actual API keys and configuration.

4. Run the development server
   ```sh
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Login or create an account
2. Create a new project or open an existing one
3. Add nodes to your canvas by clicking the toolbar buttons
4. Connect nodes by dragging from one node's output to another node's input
5. Configure node settings as needed
6. Run your workflow to process data through the AI models

## API Usage

Tersa provides several API endpoints for programmatic interaction:

### Chat API
Generate text responses using AI models:

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Hello, how are you?' }
    ],
    modelId: 'gpt-4o'
  })
});

const data = await response.json();
```

### Code Generation API
Generate code using AI models:

```javascript
const response = await fetch('/api/code', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Create a React component for a button' }
    ],
    modelId: 'claude-3-5-sonnet',
    language: 'typescript'
  })
});

const data = await response.json();
```

### Server Actions
Tersa also provides server actions for various operations:

```javascript
import { generateImageAction } from '@/app/actions/image/create';

// Generate an image
const result = await generateImageAction({
  prompt: 'A beautiful landscape',
  modelId: 'dall-e-3',
  nodeId: 'your-node-id',
  projectId: 'your-project-id',
  size: '1024x1024'
});
```

## Troubleshooting

### Common Issues

#### Environment Variables Error
**Problem:** `Error: Invalid environment variables`

**Solution:** 
1. Ensure you have created a `.env.local` file in the root directory
2. Copy from `.env.example`: `cp .env.example .env.local`
3. Update the dummy values with your actual API keys
4. Restart the development server

#### Supabase Connection Issues
**Problem:** Database connection errors or authentication failures

**Solution:**
1. Ensure Supabase CLI is installed: `npm install -g @supabase/cli`
2. Start Supabase locally: `npx supabase start`
3. Check that `POSTGRES_URL` and Supabase keys are correctly set in `.env.local`
4. Verify your Supabase project is running

#### Port Conflicts
**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
1. Kill the process using port 3000: `lsof -ti:3000 | xargs kill -9`
2. Or use a different port: `pnpm dev -- -p 3001`

#### AI Model API Errors
**Problem:** `Error: Invalid API key` or model-specific errors

**Solution:**
1. Verify your API keys are correctly set in `.env.local`
2. Check that your API keys have the necessary permissions
3. Ensure you have sufficient credits/quota with the AI provider
4. For OpenAI: Verify your organization and project settings

#### Build Errors
**Problem:** TypeScript or build compilation errors

**Solution:**
1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && pnpm install`
3. Check for TypeScript errors: `pnpm build`

#### Stripe Webhook Issues
**Problem:** Stripe webhook events not being received

**Solution:**
1. Ensure Stripe CLI is installed and logged in
2. Run the webhook listener: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Update `STRIPE_WEBHOOK_SECRET` with the webhook signing secret from Stripe CLI

### Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/haydenbleasel/tersa/issues) for similar problems
2. Review the [Contributing Guidelines](CONTRIBUTING.md) for development setup
3. Contact support via [Twitter/X](https://x.com/haydenbleasel)

### Development Tips

- Use `pnpm dev` to start all services (Next.js, Supabase, Email, Stripe) concurrently
- Check browser console and terminal for detailed error messages
- Ensure all required services are running before testing features
- Use the development environment for testing before deploying to production

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get started.

---

Made with ❤️ and 🤖 by [Hayden Bleasel](https://x.com/haydenbleasel).
