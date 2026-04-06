---
name: test-scaffold
description: Generates test files for source code. Use when the
  user asks to write tests, add test coverage, or mentions testing.
---

# Test Scaffolding

When asked to create tests:

1. Detect the testing framework:
   - Check package.json for jest, vitest, mocha, @testing-library
   - Check for pytest, unittest in Python projects
   - Check for existing test files to see what's already in use

2. Match existing test conventions:
   - File naming: .test.ts, .spec.ts, or __tests__/ directory
   - Import style: require vs import
   - Assertion style: expect().toBe() vs assert.equal()
   - Describe/it nesting patterns

3. Read the source file to understand:
   - Exported functions and their signatures
   - Component props and behavior
   - Side effects and dependencies to mock

4. Write tests covering:
   - Happy path for each exported function/component
   - Edge cases: null, undefined, empty string, empty array,
     boundary values
   - Error cases: invalid inputs, network failures, timeouts
   - Type-specific: if TypeScript, test that types are enforced

5. Add mocking as needed:
   - Mock external APIs and database calls
   - Mock timers for time-dependent code
   - Use the project's existing mock utilities if present

## Output
- One test file per source file
- Clear test names: "should [expected behavior] when [condition]"
- Group related tests in describe blocks
- Comments for non-obvious test logic