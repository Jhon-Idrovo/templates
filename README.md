A ready-to-go starter for creating Single Page Applications with React, Next.js, Typescript and Tailwind.css

Readily configured to purge unneeded tailwind styles when building for production.

## REDUX

- Uses duck pattern for folder organization
- A logger function is used which can be modified to work in production writing the logs to a server
- All actions, selectors, slice and more related items are in one file for each slice. This goes along the principle of cohesion.
  Furthermore, it allows to not export things that are internal to that slice and should not be called outside that module.
