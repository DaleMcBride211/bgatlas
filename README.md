# Overview

I developed a geospatial web application designed to visualize hunting data for the state of Wyoming. Currently, hunters have to cross-reference static PDF harvest reports with separate map files to plan their hunts. This software solves that problem by integrating the two datasets into a single, interactive interface. The application displays vector-based hunt area boundaries for big game species. When a user interacts with a specific area on the map, the application retrieves and displays the specific harvest data (tags issued, harvest success rates, etc.) for that unit.

My purpose for writing this software was to challenge myself to build a full-stack application that handles complex data visualization. I specifically wanted to gain proficiency in integrating third-party mapping APIs (MapTiler) with a modern frontend framework, while also managing secure user authentication. This project allowed me to explore the practical applications of GIS (Geographic Information Systems) within a React-based environment.

[Software Demo Video](https://youtu.be/rDjTTSCBZcw)

# Development Environment

To develop this software, I utilized Visual Studio Code as my primary IDE, utilizing Git for version control. I used Node.js to manage dependencies and run the development server.

**Programming Language and Libraries:**
* **TypeScript:** Used for the core logic to ensure type safety, particularly for the complex shapes of the Hunt Area and Harvest Data objects.
* **Next.js (React Framework):** Used for the frontend structure, routing, and rendering of the application.
* **MapTiler SDK:** Used to render the interactive vector maps and handle the geospatial boundary data.
* **Firebase Authentication:** Implemented to manage user sign-in and security.
* **CSS/Tailwind:** Used for styling the user interface.

# Useful Websites

* [MapTiler Documentation](https://docs.maptiler.com/sdk-js/)
* [Next.js Documentation](https://nextjs.org/docs)
* [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
* [Wyoming Game and Fish Department](https://wgfd.wyo.gov/hunting/harvest-reports)

# Future Work

* **Advanced Filtering:** I need to add a sidebar that allows users to filter the map based on specific criteria, such as "Show only areas with > 50% success rate."
* **Database Integration:** Currently, the harvest data is static. I plan to migrate this to a PostgreSQL database to allow for dynamic updates and historical data tracking.
* **Mobile Responsiveness:** I need to improve the CSS styling to ensure the map interface is fully usable on mobile devices, as the current layout is optimized for desktop.