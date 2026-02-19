February 16, 2026 Modifications:

1. Navigation Hover Effects (_header.scss)

Links lift up 2px on hover
Animated underline grows from left to right
Text color changes to orange
Logo scales up 1.05x on hover

2. Button Improvements (_button.scss)

Gradient backgrounds instead of flat colors
Ripple effect animation on click
3D lift with shadows on hover
Shimmer animation option for CTAs

3. Hero Image Carousel (HeroSection.tsx + loaders.ts)

Multiple images fade between each other every 5 seconds
Clickable dots at bottom to jump between images
Updated Strapi query to fetch image array

4. Logo Bounce Animation (_hero-section.scss + HeroSection.tsx)

Logo bounces up/down to indicate "scroll down"
Bounces while in hero section (0-70%)
Stops bouncing when leaving hero (70%+)
Restarts when scrolling back to top

5. Scroll Effects (HeroSection.tsx)

Blur: Image blurs when leaving hero (70%+)
Fade: Logo fades out when leaving hero (70%+)
All synchronized: Bounce stop, blur, and fade happen together

6. Logo Visibility Fix (_hero-section.scss)

Reduced hero height to 70rem
Logo positioned at 8rem from bottom
Dots at 2rem from bottom (below logo)
Fully visible at 100% zoom without scrolling
