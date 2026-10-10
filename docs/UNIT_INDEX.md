# The 81 learning units — quick content index

Read this for a fast overview; `data/curriculum.json` remains authoritative. Each level contains full skills, lab steps, assessment rubrics and resources not repeated here.

## 01 · Computer Science Fundamentals — NOW
Explain what happens underneath software: process, network, hardware, and mathematical reasoning.

### Operating systems (`cs-os`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `cs-os-l1` | Explain how an application executes on an OS. | Inspect a running Python program |
| **L2** / `cs-os-l2` | Reason correctly about concurrent programs. | Reproduce and fix a race condition |
| **L3** / `cs-os-l3` | Diagnose OS-level runtime and resource failures. | Investigate resource exhaustion |

### Computer networking (`cs-net`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `cs-net-l1` | Trace a real HTTP request. | Trace your API over HTTP |
| **L2** / `cs-net-l2` | Debug practical API/network behavior. | Put a reverse proxy in front of an API |
| **L3** / `cs-net-l3` | Design around unreliable networks. | Simulate network uncertainty |

### Computer architecture and runtime (`cs-arch`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `cs-arch-l1` | Recognize hardware and runtime bottlenecks. | Measure CPU versus file workload |
| **L2** / `cs-arch-l2` | Use profiling instead of guessing. | Compare execution models |
| **L3** / `cs-arch-l3` | Optimize measured performance safely. | Produce an optimization case study |

### Discrete mathematics and reasoning (`cs-math`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `cs-math-l1` | Use math to reason about software. | Model and analyze two algorithms |
| **L2** / `cs-math-l2` | Prove and quantify algorithm behavior. | Explain correctness with invariants |
| **L3** / `cs-math-l3` | Apply quantitative models to engineering. | Model and validate performance assumptions |

## 02 · Python Programming — NOW
Use Python fluently as an implementation language, then engineer maintainable, tested software.

### Python language and standard library (`python-core`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `python-core-l1` | Write complete small Python programs using language features. | Build a command-line knowledge manager |
| **L2** / `python-core-l2` | Structure Python programs as tested components. | Extract a typed reusable library |
| **L3** / `python-core-l3` | Understand advanced language/runtime trade-offs. | Benchmark competing implementations |

### Python developer tools and quality (`python-tooling`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `python-tooling-l1` | Work fluently with local development tools. | Make a clean reproducible repo |
| **L2** / `python-tooling-l2` | Maintain quality with automation. | Install a quality gate |
| **L3** / `python-tooling-l3` | Deliver robust reusable Python components. | Publish a versioned internal package |

## 03 · Data Structures and Algorithms — NOW
Develop algorithmic reasoning for interviews and real product decisions.

### Core algorithm patterns (`dsa-patterns`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `dsa-patterns-l1` | Recognize and implement common coding patterns. | Implement a search and deduplication toolkit |
| **L2** / `dsa-patterns-l2` | Choose patterns for unfamiliar constraints. | Compare algorithm variants |
| **L3** / `dsa-patterns-l3` | Reason about constraints and optimality. | Optimize a high-volume data function |

### Trees, heaps, graphs and advanced patterns (`dsa-structures`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `dsa-structures-l1` | Understand structural models and traversals. | Build a dependency viewer |
| **L2** / `dsa-structures-l2` | Solve advanced common interview questions. | Create an intelligent task scheduler |
| **L3** / `dsa-structures-l3` | Handle complex algorithms with evidence. | Optimize a scheduling/search engine |

### Applied algorithms inside products (`dsa-applied`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `dsa-applied-l1` | Spot everyday structures in a feature. | Add algorithms to CLI product |
| **L2** / `dsa-applied-l2` | Build algorithmic product components. | Add autocomplete and dependency logic |
| **L3** / `dsa-applied-l3` | Make performance decisions systematically. | Design a constrained search service |

## 04 · Databases and Data Correctness — NOW
Model reliable data, use SQL, and reason about transactions and performance.

### Relational modeling and SQL (`db-sql`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `db-sql-l1` | Design and query a relational schema. | Create the knowledge platform schema |
| **L2** / `db-sql-l2` | Maintain evolving data models. | Migrate and optimize the data model |
| **L3** / `db-sql-l3` | Design storage around scale and recovery. | Plan data growth |

### Transactions, isolation and performance (`db-correctness`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `db-correctness-l1` | Recognize correctness boundaries. | Reproduce a broken update flow |
| **L2** / `db-correctness-l2` | Investigate concurrent access and bottlenecks. | Make concurrent edits safe |
| **L3** / `db-correctness-l3` | Reason about distributed data systems. | Design reliable read replicas on paper |

## 05 · Software Development and Architecture — NOW
Deliver useful, secure, testable products that can evolve over time.

### Backend APIs and application features (`sw-api`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `sw-api-l1` | Implement well-defined HTTP APIs. | Turn CLI into FastAPI service |
| **L2** / `sw-api-l2` | Deliver maintainable backend features. | Build a multi-user document API |
| **L3** / `sw-api-l3` | Design complex API evolution. | Refactor public API without breaking clients |

### Testing, debugging, and software quality (`sw-testing`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `sw-testing-l1` | Test and diagnose basic behavior. | Add meaningful tests |
| **L2** / `sw-testing-l2` | Create a quality process for changing code. | Refactor with regression protection |
| **L3** / `sw-testing-l3` | Evaluate reliability of large software. | Build a reliability-focused test strategy |

### Code architecture and requirements (`sw-architecture`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `sw-architecture-l1` | Organize small applications logically. | Refactor a tangled feature |
| **L2** / `sw-architecture-l2` | Design maintainable multi-feature systems. | Write an architecture decision and implement it |
| **L3** / `sw-architecture-l3` | Evolve larger codebases with low risk. | Plan a modularization |

## 06 · System Design — NOW
Translate requirements and workloads into justified architectures and trade-offs.

### Low-level design and interfaces (`sd-lld`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `sd-lld-l1` | Design clear modules and object responsibilities. | Design a library-management module |
| **L2** / `sd-lld-l2` | Reason about change and extensibility. | Build a configurable notification engine |
| **L3** / `sd-lld-l3` | Design large internal systems. | Review a legacy subsystem |

### High-level design and scalability (`sd-hld`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `sd-hld-l1` | Draw and explain a service architecture. | Design a document upload service |
| **L2** / `sd-hld-l2` | Scale and harden designs under workload. | Scale a notification design |
| **L3** / `sd-hld-l3` | Design for major scale and evolution. | Prepare a scaling review |

### Distributed systems reasoning (`sd-distributed`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `sd-distributed-l1` | Understand why distributed systems differ. | Make a duplicate-safe job processor |
| **L2** / `sd-distributed-l2` | Design coordination and consistency strategies. | Add an outbox to a business action |
| **L3** / `sd-distributed-l3` | Reason about advanced distributed coordination. | Design a cross-region workflow on paper |

## 07 · Security Engineering — NOW
Build access controls and secure applications from the beginning.

### Application and API security (`sec-app`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `sec-app-l1` | Apply secure-by-default basics. | Test document privacy |
| **L2** / `sec-app-l2` | Defend common API attack surfaces. | Conduct an API abuse test |
| **L3** / `sec-app-l3` | Build deeper security assurance. | Threat-model a deployed service |

### Infrastructure and operational security (`sec-infra`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `sec-infra-l1` | Protect a basic deployment. | Harden a Dockerized service |
| **L2** / `sec-infra-l2` | Implement operational safeguards. | Review permissions for cloud resources |
| **L3** / `sec-infra-l3` | Design layered production security. | Draft incident response exercise |

## 08 · Production Engineering and Cloud — NOW
Run, observe and improve services reliably without adopting complex tooling too early.

### Linux, Docker and deployment (`prod-containers`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `prod-containers-l1` | Deploy one working application. | Containerize and deploy API |
| **L2** / `prod-containers-l2` | Operate reliable multi-component deployments. | Test deployment and rollback |
| **L3** / `prod-containers-l3` | Understand orchestration at scale. | Deploy a safe Kubernetes lab |

### CI/CD, observability and reliability (`prod-delivery`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `prod-delivery-l1` | Automate basic quality and observe running code. | Create a repeatable quality pipeline |
| **L2** / `prod-delivery-l2` | Diagnose and recover from production incidents. | Run a controlled failure drill |
| **L3** / `prod-delivery-l3` | Operate a complex service responsibly. | Design an operations readiness review |

### Cloud architecture, messaging, and infrastructure (`prod-cloud`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `prod-cloud-l1` | Recognize basic cloud services and responsibilities. | Deploy using managed components |
| **L2** / `prod-cloud-l2` | Select scalable services based on needs. | Benchmark background workload |
| **L3** / `prod-cloud-l3` | Reason about advanced cloud platforms. | Prototype event streaming in a sandbox |

## 09 · AI Engineering (Later Specialization) — LATER
Understand AI branches, then build evaluated systems after establishing software engineering foundations.

### Machine learning foundations (`ai-foundations`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `ai-foundations-l1` | Recognize key AI and ML concepts. | Train and evaluate a tiny classifier |
| **L2** / `ai-foundations-l2` | Apply ML concepts to practical problems. | Build semantic similarity search baseline |
| **L3** / `ai-foundations-l3` | Reason about model-centric infrastructure. | Design an ML service operations plan |

### Generative AI, LLM applications, and RAG (`ai-llm`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `ai-llm-l1` | Integrate an LLM safely. | Add structured document extraction |
| **L2** / `ai-llm-l2` | Build and evaluate grounded retrieval. | Build source-cited document Q&A |
| **L3** / `ai-llm-l3` | Harden AI applications in production. | Run an LLM product evaluation campaign |

### Tool-using agents and AI operations (`ai-agents`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `ai-agents-l1` | Understand tool calling and workflow boundaries. | Build an approved tool-calling workflow |
| **L2** / `ai-agents-l2` | Design durable agent workflows. | Create a resumable research workflow |
| **L3** / `ai-agents-l3` | Operate production agent systems. | Create an agent reliability testbed |

## 10 · Professional Engineering and Interviews — NOW
Turn knowledge into explainable decisions, reviewable work and interview readiness.

### Debugging, code reading and ownership (`pr-debug`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `pr-debug-l1` | Find and fix small unfamiliar bugs. | Fix a seeded unfamiliar bug |
| **L2** / `pr-debug-l2` | Own complex feature reliability. | Deliver an ambiguous feature request |
| **L3** / `pr-debug-l3` | Lead investigation of system incidents. | Write a production-style postmortem |

### Communication, career and interview practice (`pr-communication`)
| Level / ID | Outcome | Practical lab |
|---|---|---|
| **L1** / `pr-communication-l1` | Explain technical decisions clearly. | Record a 5-minute feature explanation |
| **L2** / `pr-communication-l2` | Perform in realistic technical interviews. | Complete a mock interview packet |
| **L3** / `pr-communication-l3` | Demonstrate senior-level technical communication. | Lead a simulated architecture review |

