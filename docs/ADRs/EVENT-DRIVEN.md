ADR 001: Target Architecture, Stack Modernization, and Event-Driven Message Queue
Status: Accepted
Date: 2026-09-10

### 1. Context and Problem Statement

In a Kanban-based project management application, user actions (such as moving a task to "Done" or creating a new item) trigger secondary operations like audit logging, metrics calculation, and user notifications.

Performing these side effects synchronously within the main HTTP request-response cycle creates several architectural bottlenecks:

- Increased API latency for the end user.

- Tightly coupled domain logic where core task operations depend on logging/notification services.

- Vulnerability to service failures: if a side-effect task fails, it risks causing the entire HTTP request to fail or leaving the system in an inconsistent state.

We need a decoupled, asynchronous mechanism to handle domain events reliably without blocking the main Express REST API.

### Decided Architecture & Demonstrable Workflow

We adopt an event-driven message queue architecture using Redis as the message broker and BullMQ as the queue producer and consumer manager in TypeScript.

Demonstrable Workflow Diagram:

```
  +-----------------+
  |    Client       |
  +--------+--------+
           |
           | 1. PATCH /api/tasks/:id/status (Move task to 'Done')
           v
  +-----------------+           +-------------------+
  |  Express API    | --------> |   MySQL Database  |
  |   (Producer)    |           | Update Task State |
  +--------+--------+           +-------------------+
           |
           | 2. Publish 'TASK_STATUS_CHANGED' event
           |    (Non-blocking)
           v
  +-------------------------------------------------+
  |                   Redis Broker                  |
  |             [ BullMQ Queue: 'task-events' ]     |
  +------------------------+------------------------+
                           |
                           | 3. Dequeue job asynchronously
                           v
              +--------------------------+
              |     BullMQ Worker        |
              |        (Consumer)        |
              +------------+-------------+
                           |
                           | 4. Persist side-effect asynchronously
                           v
              +--------------------------+
              |  MySQL: todo_audit_logs  |
              +--------------------------+
```

### 3. Detailed Component Responsibilities

1. Event Producer (Express API Controller):

Processes the primary domain logic (e.g., updating a task's status in the database).

Pushes a structured payload (event name, task ID, user ID, timestamp) to the BullMQ task-events queue.

Immediately returns a 200 OK HTTP response to the client without waiting for downstream side effects.

2. Message Queue (Redis + BullMQ):

Acts as a reliable buffer for asynchronous events.

Provides automatic retries with exponential backoff if a worker fails to process a job.

3. Event Consumer (BullMQ Worker):

Runs in the background, consuming jobs from the queue.

Executes secondary operations, specifically writing an entry to the todo_audit_logs table.

### 4. Consequences & Trade-offs

#### Positive Consequences

Decoupling: Core domain logic (tasks) is completely isolated from secondary operations (audit logging, notifications).

Improved Performance: Lower API response latency since side-effects run asynchronously.

Resilience: Failed worker jobs can be retried automatically without impacting the client's request.

#### Negative / Accepted Trade-offs

Infrastructure Overhead: Requires running and maintaining a Redis instance alongside the main application.

Eventual Consistency: Audit log entries are written asynchronously milliseconds after the HTTP response returns, rather than atomically in the same database transaction.
