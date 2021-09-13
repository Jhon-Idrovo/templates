A ready-to-go starter for creating Single Page Applications with React, Next.js, Typescript and Tailwind.css

Readily configured to purge unneeded tailwind styles when building for production.

## REDUX

- Uses duck pattern for folder organization
- A logger function is used which can be modified to work in production writing the logs to a server
- All actions, selectors, slice and more related items are in one file for each slice. This goes along the principle of cohesion.
  Furthermore, it allows to not export things that are internal to that slice and should not be called outside that module.

# Usage of createAsyncThunk

I restricted the usage of this method due to the lack of flexibility to handle the response error message. If the request fails we simply dont get the response data. Obviously there are workarounds, but for me it's becoming messy.

## TESTS

# Testing Approach

- Tests are directed to assert the behaviour, not implementation. That is, I check that the result of the whole system is the rigth one, rather than checking every piece.
  This is better since reduces coupling between tests and implementation.

- Tests follow the patter of AAA (Arrange, Act and Assert)
