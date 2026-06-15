# Code-Specific Reflection Criteria

Detailed criteria for evaluating code quality, architecture, and testing.

## Library & Existing Solution Check

**BEFORE PROCEEDING WITH CUSTOM CODE:**

1. **Search for Existing Libraries**
   - [ ] Have you searched npm/PyPI/Maven for existing solutions?
   - [ ] Is this a common problem that others have already solved?
   - [ ] Are you reinventing the wheel for utility functions?

   **Common areas to check:**
   - Date/time manipulation → moment.js, date-fns, dayjs
   - Form validation → joi, yup, zod
   - HTTP requests → axios, fetch, got
   - State management → Redux, MobX, Zustand
   - Utility functions → lodash, ramda, underscore

2. **Existing Service/Solution Evaluation**
   - [ ] Could this be handled by an existing service/SaaS?
   - [ ] Is there an open-source solution that fits?
   - [ ] Would a third-party API be more maintainable?

   **Examples:**
   - Authentication → Auth0, Supabase, Firebase Auth
   - Email sending → SendGrid, Mailgun, AWS SES
   - File storage → S3, Cloudinary, Firebase Storage
   - Search → Elasticsearch, Algolia, MeiliSearch
   - Queue/Jobs → Bull, RabbitMQ, AWS SQS

3. **Decision Framework**

   ```
   IF common utility function → Use established library
   ELSE IF complex domain-specific → Check for specialized libraries
   ELSE IF infrastructure concern → Look for managed services
   ELSE → Consider custom implementation
   ```

4. **When Custom Code IS Justified**
   - Specific business logic unique to your domain
   - Performance-critical paths with special requirements
   - When external dependencies would be overkill (e.g., lodash for one function)
   - Security-sensitive code requiring full control
   - When existing solutions don't meet requirements after evaluation

### Real Examples of Library-First Approach

**❌ BAD: Custom Implementation**

```javascript
// utils/dateFormatter.js
function formatDate(date) {
  const d = new Date(date);
  return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
}
```

**✅ GOOD: Use Existing Library**

```javascript
import { format } from 'date-fns';
const formatted = format(new Date(), 'MM/dd/yyyy');
```

**❌ BAD: Generic Utilities Folder**

```
/src/utils/
  - helpers.js
  - common.js
  - shared.js
```

**✅ GOOD: Domain-Driven Structure**

```
/src/order/
  - domain/OrderCalculator.js
  - infrastructure/OrderRepository.js
/src/user/
  - domain/UserValidator.js
  - application/UserRegistrationService.js
```

## Common Anti-Patterns to Avoid

1. **NIH (Not Invented Here) Syndrome**
   - Building custom auth when Auth0/Supabase exists
   - Writing custom state management instead of using Redux/Zustand
   - Creating custom form validation instead of using Formik/React Hook Form

2. **Poor Architectural Choices**
   - Mixing business logic with UI components
   - Database queries in controllers
   - No clear separation of concerns

3. **Generic Naming Anti-Patterns**
   - `utils.js` with 50 unrelated functions
   - `helpers/misc.js` as a dumping ground
   - `common/shared.js` with unclear purpose

## Architecture and Design

1. **Clean Architecture & DDD Alignment**
   - [ ] Does naming follow ubiquitous language of the domain?
   - [ ] Are domain entities separated from infrastructure?
   - [ ] Is business logic independent of frameworks?
   - [ ] Are use cases clearly defined and isolated?

   **Naming Convention Check:**
   - Avoid generic names: `utils`, `helpers`, `common`, `shared`
   - Use domain-specific names: `OrderCalculator`, `UserAuthenticator`
   - Follow bounded context naming: `Billing.InvoiceGenerator`

2. **Design Patterns**
   - Is the current design pattern appropriate?
   - Could a different pattern simplify the solution?
   - Are SOLID principles being followed?

3. **Modularity**
   - Can the code be broken into smaller, reusable functions?
   - Are responsibilities properly separated?
   - Is there unnecessary coupling between components?
   - Does each module have a single, clear purpose?

## Code Quality

1. **Simplification Opportunities**
   - Can any complex logic be simplified?
   - Are there redundant operations?
   - Can loops be replaced with more elegant solutions?

2. **Performance Considerations**
   - Are there obvious performance bottlenecks?
   - Could algorithmic complexity be improved?
   - Are resources being used efficiently?
   - **IMPORTANT**: Any performance claims in comments must be verified

3. **Error Handling**
   - Are all potential errors properly handled?
   - Is error handling consistent throughout?
   - Are error messages informative?

## Testing and Validation

1. **Test Coverage**
   - Are all critical paths tested?
   - Missing edge cases to test:
     - Boundary conditions
     - Null/empty inputs
     - Large/extreme values
     - Concurrent access scenarios
   - Are tests meaningful and not just for coverage?

2. **Test Quality**
   - Are tests independent and isolated?
   - Do tests follow AAA pattern (Arrange, Act, Assert)?
   - Are test names descriptive?
