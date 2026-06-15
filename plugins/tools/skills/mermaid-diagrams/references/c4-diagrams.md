# C4 Model Diagrams

The C4 model gives you four architecture views at increasing levels of detail.

## C4 Levels

```text
1. Context    -> system and external actors
2. Container  -> apps, services, data stores, queues
3. Component  -> internal parts of one container
4. Code       -> regular code or class diagrams
```

Use the simplest level that answers the audience’s question.

## Context Diagram

Use this for:
- stakeholders
- product and platform alignment
- system boundaries and external dependencies

```mermaid
C4Context
    title Banking System - Context

    Person(customer, "Customer", "Uses online banking")
    System(banking, "Banking System", "Manages accounts and payments")
    System_Ext(email, "Email System", "Sends notifications")

    Rel(customer, banking, "Uses")
    Rel(banking, email, "Sends emails via")
```

## Container Diagram

Use this for:
- application boundaries
- protocols between services
- databases, queues, and external integrations

```mermaid
C4Container
    title Banking System - Containers

    Person(customer, "Customer")
    Container(web, "Web App", "React", "User interface")
    Container(api, "API", "FastAPI", "Business logic")
    ContainerDb(db, "Database", "PostgreSQL", "Accounts and transactions")

    Rel(customer, web, "Uses")
    Rel(web, api, "Calls", "HTTPS/JSON")
    Rel(api, db, "Reads/writes", "SQL")
```

## Component Diagram

Use this for:
- developer-facing service design
- internal responsibilities inside one container

```mermaid
C4Component
    title Order Service - Components

    ContainerDb(db, "Database", "PostgreSQL")
    Component(controller, "Order Controller", "HTTP handlers")
    Component(service, "Order Service", "Business logic")
    Component(repository, "Order Repository", "Persistence layer")

    Rel(controller, service, "Calls")
    Rel(service, repository, "Uses")
    Rel(repository, db, "Reads/writes", "SQL")
```

## Common Patterns

### Multi-Team Microservices

At context level, separate team-owned domains can be modeled as systems:

```mermaid
C4Context
    Person(customer, "Customer")
    System(orderSystem, "Order System", "Order management")
    System(productSystem, "Product System", "Catalog and inventory")
    System_Ext(payment, "Payment Provider", "External payments")

    Rel(customer, orderSystem, "Places orders")
    Rel(orderSystem, productSystem, "Checks inventory")
    Rel(orderSystem, payment, "Processes payments")
```

### Event-Driven Containers

Model important topics separately instead of one generic “Kafka” box:

```mermaid
C4Container
    Container(orderSvc, "Order Service", "Go")
    Container(eventBus, "OrderCreated Topic", "Kafka topic")
    Container(inventorySvc, "Inventory Service", "Rust")

    Rel(orderSvc, eventBus, "Publishes", "Avro")
    Rel(inventorySvc, eventBus, "Consumes", "Avro")
```

### API Gateway with BFF

```mermaid
C4Container
    Person(mobile, "Mobile User")
    Container(bff, "Mobile BFF", "Node.js")
    Container(gateway, "API Gateway", "Envoy")
    Container(userApi, "User API", "FastAPI")

    Rel(mobile, bff, "Uses")
    Rel(bff, gateway, "Calls", "HTTPS")
    Rel(gateway, userApi, "Routes /users/*", "HTTPS")
```

## Best Practices

```text
Keep one clear story per diagram
Reuse the same names across levels
Add technology labels at container/component level
Use boundaries when they clarify ownership
Split diagrams before they become crowded
```

Rule of thumb:
- Context for broad relationships
- Container for deployment/runtime architecture
- Component for inside-one-service design
