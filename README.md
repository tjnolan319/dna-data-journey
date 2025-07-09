

# DNA Data Journey - Professional Portfolio

A comprehensive professional portfolio showcasing data analytics expertise, built with React and modern web technologies.

## Project Overview

**URL**: https://lovable.dev/projects/d822a6f3-fba4-4b81-afd9-8d9eb56d6c84

This is Timothy Nolan's professional portfolio featuring interactive data visualizations, project showcases, and a comprehensive timeline of professional and academic achievements. The application demonstrates expertise in data analytics, business intelligence, and web development.

## Technologies Used

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **Supabase** - Backend-as-a-Service for authentication and data storage
- **React Router** - Client-side routing
- **Recharts** - Data visualization library
- **D3.js** - Advanced data manipulation and visualization
- **Tanstack Query** - Data fetching and state management

## Project Structure

### Root Files
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

### Source Code (`src/`)

#### Main Application Files
- `main.tsx` - Application entry point
- `App.tsx` - Main app component with routing configuration
- `index.css` - Global styles and Tailwind imports

#### Pages (`src/pages/`)
- `Index.tsx` - Homepage with all main sections
- `GenreCategoryProject.tsx` - Detailed project showcase page
- `SkillsetNetwork.tsx` - Interactive skills network visualization
- `TimelinePage.tsx` - Professional timeline page
- `AcademicTimelinePage.tsx` - Academic timeline page
- `SbcWorkflowPage.tsx` - Workflow demonstration page
- `SignupPage.tsx` - Newsletter signup for Lab Notes
- `LoginPage.tsx` - Admin login page
- `AdminDashboard.tsx` - Admin dashboard with navigation
- `AdminLabNotes.tsx` - Lab notes management interface
- `AdminLabNoteEditor.tsx` - Lab note creation and editing interface
- `NotFound.tsx` - 404 error page with DNA-themed design

#### Components (`src/components/`)

**Navigation & Layout**
- `Navigation.tsx` - Main navigation bar with responsive design and authentication buttons
- `ProjectTabs.tsx` - Tabbed interface for portfolio sections (Projects, Case Studies, Dashboards, Publications, Certifications, Lab Notes)

**Hero & About Sections**
- `DNAHero.tsx` - Animated DNA helix hero section with professional introduction
- `TechStack.tsx` - Interactive technology stack showcase

**Timeline Components**
- `TimelinePreview.tsx` - Preview of professional timeline on homepage
- `GanttChart.tsx` - Interactive Gantt chart for project timelines
- `DNATimeline.tsx` - DNA-themed academic timeline visualization

**Data Visualization**
- `DataGallery.tsx` - Carousel of data visualization examples
- `ContactForm.tsx` - Contact form with validation

**Lab Notes System**
- `LabNotePreview.tsx` - Rich preview modal with markdown rendering, colored box syntax, and dynamic related notes

**UI Components (`src/components/ui/`)**
- Comprehensive shadcn/ui component library including:
  - Form controls (Button, Input, Select, Switch, etc.)
  - Layout components (Card, Tabs, Dialog, etc.)
  - Navigation (Carousel, Breadcrumb, etc.)
  - Feedback (Toast, Alert, etc.)

#### Utilities & Configuration
- `src/lib/utils.ts` - Utility functions for class merging
- `src/api/projectApi.js` - API functions for fetching project data from Supabase

#### Supabase Integration
- `src/integrations/supabase/client.ts` - Supabase client configuration
- `src/integrations/supabase/types.ts` - Auto-generated TypeScript types

#### Assets (`src/assets/`)
- `BPMN_of_SBC.jpg` - Business process diagram
- `Tim_Nolan_Profile_Pic_Cropped.jpg` - Professional profile photo
- Various data visualization images for project showcases

## Key Features

### 🧬 DNA-Themed Design
- Animated DNA helix in hero section
- DNA-inspired timeline visualizations
- Science-themed 404 page

### 📊 Interactive Data Visualizations
- Dynamic project timeline with Gantt charts
- Skills network visualization
- Data gallery carousel
- Professional achievement timelines

### 🎯 Portfolio Showcase
- Tabbed interface for different content types
- Project details with technology stacks
- Case studies and publications
- Interactive dashboards

### 🔐 Admin System & Lab Notes
- Secure admin authentication with Supabase RLS policies
- Full CRUD operations for lab notes management
- Rich text editor with Markdown support and colored box syntax
- Dynamic publication status with visual indicators (switch controls)
- Real-time related notes based on recent publications
- Author attribution (Tim Nolan) on all notes
- Preview system with tabbed content navigation

### 📱 Responsive Design
- Mobile-first approach
- Adaptive navigation
- Optimized for all screen sizes

## Admin Features

### Lab Notes Management
- **Secure Access**: Admin-only access protected by Row Level Security
- **Rich Editor**: Tabbed interface for different content sections (Analysis, Methodology, Code, Insights)
- **Markdown Support**: Full Markdown rendering with syntax highlighting
- **Colored Boxes**: Custom syntax for creating colored information boxes
- **Publication Control**: Visual switch controls for draft/published status
- **Dynamic Preview**: Real-time preview with formatted content
- **Related Notes**: Automatically displays 2 most recent related notes
- **Author Attribution**: All notes attributed to Tim Nolan

### Content Management
- Create, read, update, and delete lab notes
- Toggle publication status with visual feedback
- Search and filter capabilities
- Category-based organization

## Database Schema

The application uses the following Supabase tables:
- `projects` - Portfolio projects with technologies and descriptions
- `case_studies` - Business case studies and analyses
- `dashboards` - Dashboard projects and visualizations
- `publications` - Academic and professional publications
- `certifications` - Professional certifications and credentials
- `newsletter_subscribers` - Lab Notes newsletter subscribers
- `lab_notes` - Lab notes with rich content, categories, and publication status

### Row Level Security (RLS)
- Admin access restricted to `tjnolan319@gmail.com`
- Public read access for published lab notes only
- Secure CRUD operations with proper authentication

## How to Run the Project

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Local Development
```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```sh
# Create production build
npm run build

# Preview production build
npm run preview
```

## Environment Setup

The project is configured with Supabase integration:
- **Project ID**: `mlrfleeflqqfacrknnzf`
- **Environment**: Fully configured for production use
- **Authentication**: Admin login system implemented
- **Database**: Complete schema with RLS policies

## Recent Updates

### Lab Notes System Enhancement
- **Improved UI/UX**: Enhanced draft/published indicators with switch controls and status icons
- **Rich Content Support**: Added colored box syntax tips in editor for better user guidance
- **Dynamic Related Content**: Replaced hardcoded placeholders with real-time related notes queries
- **Author Attribution**: Added "Written by Tim Nolan" to all lab note cards and previews
- **Better Preview Experience**: Removed redundant syntax help section from preview modal

### Admin Interface Improvements
- **Navigation Enhancement**: Added homepage navigation from admin dashboard
- **Visual Status Indicators**: Improved published/draft status display with color-coded switches
- **Content Management**: Full CRUD operations with proper error handling and user feedback

## Deployment

The project is configured for automatic deployment through GitHub Actions. Simply push to the main branch to trigger deployment.

### Manual Deployment
You can also deploy through the Lovable interface by clicking the "Publish" button.

### Custom Domain
To connect a custom domain, navigate to Project > Settings > Domains in Lovable (requires paid plan).

## Development Notes

- The project uses TypeScript for type safety
- Components are organized by functionality
- API calls are centralized and use Supabase client
- Responsive design follows mobile-first principles
- Error handling includes user-friendly feedback
- Admin features require authentication
- Lab notes support rich Markdown content with custom extensions

## Contact

For questions about this portfolio or to discuss potential opportunities, use the contact form on the website or reach out through the provided social links.

---

*This portfolio demonstrates full-stack development capabilities with modern React, TypeScript, Supabase backend, and comprehensive admin content management systems.*

```
