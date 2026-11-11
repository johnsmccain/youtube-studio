# Development Standards

1. Never implement a feature without understanding
   its requirements.

2. Before implementation, inspect the existing
   architecture and related code.

3. Do not create duplicate utilities or services.

4. Use small, reusable modules.

5. Every feature must include appropriate tests.

6. Every external API integration must have:
   - Interface
   - Implementation
   - Error handling
   - Timeout handling
   - Retry strategy where appropriate
   - Unit tests

7. Do not hardcode secrets.

8. Do not use mock data in production code.

9. Clearly distinguish mock data from real data
   during development.

10. Update documentation when changing architecture.

11. Run linting, type checking, and tests before
    considering a task complete.

12. Do not silently change architectural decisions.
    Explain proposed changes first.
