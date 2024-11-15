# TED Front-End Developer Interview Project


JZ NOTES:

1. use a custom hook to handle measuring displaySize and passing to children
   (noticed from the api that multiple sizes are available, and project description mentions... undecided)
	
2. use a custom hook to handle selection of themes and search. -> move the themeSelector to this

3. toggle themeSelector component via Keyboard? more time? use a socket or SSE?

4. Nice carouselCards using Swiper? (because website uses it)

5. image localStorage ... and potentially convert to string for space?

6. failing gracefully -> nice placeholder

7. focus on key areas and eval criteria


A technical interview project that creates a browser for TED talks using TED's public GraphQL API.

## Getting Started

```bash
# Clone this repository
git clone https://github.com/tedconf/fed-interview

# Install dependencies
cd fed-interview
npm install

# Start the development server
npm run dev
```

## Project Overview

## Technical Stack

- **Framework**: React + Vite
- **Language**: TypeScript
- **Data Fetching**: GraphQL with graphql-request
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS

## Development Notes

- Uses TED's public GraphQL API (graphql.ted.com)

## Project Structure

```
src/
├── components/        # React components
├── graphql/          # GraphQL operations and types
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── types/            # TypeScript type definitions
└── app/              # Application pages and layouts
```

## Key Areas to Consider

- Performance optimization
- Error handling
- Accessibility
- Loading states
- Type safety
- Component composition

## Evaluation Criteria

- Clean, maintainable code
- Proper error handling
- Performance considerations
- TypeScript usage
- Component architecture
- State management
- Loading states
- Error boundaries

## Delivery

- Provide access to this project via a private GitHub repository
  - than@ted.com & marquis@ted.com
