# AI Rules for Wedding Invitation App

## Tech Stack

- **HTML5/CSS3/JavaScript**: Static wedding invitation website with vanilla JavaScript
- **Lite Server**: Development server for serving static files
- **Google Fonts**: External typography (Cormorant Garamond, EB Garamond, Crimson Text)
- **Custom Fonts**: Local font files (GriffoClassicoSmallCaps.ttf) for branding
- **CSS3 Animations**: Folding card effects, flip clock animations, and transitions
- **Responsive Design**: Mobile-first approach with media queries for different screen sizes
- **Image Assets**: WebP and PNG format images for backgrounds, decorations, and UI elements

## Development Rules

### Libraries and Dependencies
- **DO NOT** add any JavaScript frameworks (React, Vue, Angular, etc.)
- **DO NOT** install npm packages beyond lite-server
- **DO NOT** use CSS frameworks (Bootstrap, Tailwind, etc.)
- **USE** vanilla JavaScript for all functionality
- **USE** pure CSS for all styling and animations
- **USE** CSS3 transforms and transitions for interactive effects

### Code Structure
- Keep HTML semantic and well-structured
- Organize CSS into separate files by section (style.css, countdown.css, ceremony.css)
- Keep JavaScript modular with separate files for different features
- Maintain existing file structure and naming conventions
- Use meaningful class names and IDs that reflect their purpose
- Keep functions small and focused on single responsibilities

### Styling Guidelines
- Use existing color scheme (#A15C2C, #4A2B1D, #8b7355, #f5f0eb)
- Maintain elegant, romantic wedding theme aesthetic
- Preserve existing font hierarchy and typography
- Keep responsive design patterns consistent
- Use CSS animations for user interactions (folding, flipping, fading)
- Apply mobile-first responsive design principles
- Use relative units (rem, em, %) for scalability

### Asset Management
- Use existing image assets and maintain their paths
- Optimize images for web (WebP format preferred)
- Maintain consistent visual style throughout
- Keep decorative elements (flowers, monograms) as per design
- Ensure all images have proper alt attributes for accessibility

### Performance
- Keep animations smooth and performant
- Optimize for mobile devices (max-width: 480px)
- Minimize HTTP requests where possible
- Use CSS transforms instead of JavaScript animations when possible
- Lazy load images when appropriate
- Minimize DOM manipulation in JavaScript

### Accessibility
- Ensure all interactive elements are keyboard accessible
- Use semantic HTML5 elements appropriately
- Provide text alternatives for visual content
- Maintain sufficient color contrast ratios
- Test with screen readers and keyboard navigation

### Browser Compatibility
- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Use progressive enhancement for older browsers
- Test on mobile devices (iOS Safari, Chrome Mobile)
- Ensure consistent behavior across platforms

### File Organization
```
src/
├── assets/
│   ├── fonts/
│   ├── images/
│   └── js/
├── css/
│   ├── style.css
│   ├── countdown.css
│   └── ceremony.css
└── index.html
```

### Git Workflow
- Use descriptive commit messages
- Keep commits small and focused
- Test changes before committing
- Maintain clean, readable code history

### Testing Guidelines
- Test all interactive elements on mobile devices
- Verify animations work smoothly across different screen sizes
- Check image loading and display on various network conditions
- Validate HTML structure and CSS syntax
- Test envelope opening and card folding animations
- Verify countdown timer functionality and accuracy

### Content Management
- Keep wedding date consistent across all files (January 23, 2026)
- Maintain location information accuracy (Jacobina, Bahia)
- Preserve Portuguese language content and formatting
- Update image alt text with descriptive Portuguese content
- Keep contact information and links functional

### Security Considerations
- Use HTTPS for all external resources
- Validate user inputs if any forms are added
- Sanitize any dynamic content that might be added
- Keep external font links from trusted sources (Google Fonts)
- Ensure all external links open in new tabs with proper security attributes

### Animation Guidelines
- Use CSS3 @keyframes for all animations
- Keep animation durations between 0.3s and 1.5s for optimal user experience
- Use cubic-bezier easing functions for natural motion
- Ensure animations are GPU-accelerated using transform and opacity
- Provide reduced motion support for users with vestibular disorders
- Test animations on low-end devices for performance

### Mobile Optimization
- Design primarily for mobile devices (max-width: 480px)
- Use touch-friendly tap targets (minimum 44px)
- Optimize images for mobile bandwidth constraints
- Ensure all interactive elements work with touch gestures
- Test on various mobile screen sizes and orientations
- Consider offline functionality where possible

### Debugging and Maintenance
- Use browser developer tools for debugging CSS and JavaScript
- Test with mobile device simulators and real devices
- Keep code comments clear and concise
- Document any complex animations or interactions
- Regularly check for broken links and missing assets
- Monitor performance metrics and optimize accordingly