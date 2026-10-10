# Curriculum data reader's guide

## Actual dataset layout
```
data/curriculum.json
  schema_version, dataset_id, metadata
  learner_starting_profile, principles, level_definitions
  curriculum[]
    id, title, goal, priority: now|later
    tracks[]
      id, title, why_it_matters, prerequisite_unit_ids, resource_ids
      levels[]
        id, level: L1|L2|L3, outcome, learning_mode, prerequisite_unit_ids
        skills[] { id, name, status_default }
        lab { id, title, steps[] { id, instruction }, expected_evidence }
        assessment { id, challenge, rubric[], required_evidence[] }
        resource_ids[], estimated_focus
  projects[] { id, title, description, stage, related_unit_ids, tasks[], required_evidence }
  study_plan { weeks[], parallel_routines[] }
  python_seven_day_starter { days[] }
  resources[] { id, title, source_type, url, purpose }
  progress_policy, special_notes
```

## Content counts and fidelity
See `data/manifest.json` for exact current counts: 10 subjects / 27 tracks / 81 level units / 405 individual skills / 243 lab steps / 81 assessments / 7 projects / 28 project tasks / 37 external resources. Each track has L1, L2, L3. Do not collapse course units into made-up milestones or lose named skills in UI.

## Subjects
1. **Computer Science Fundamentals:** Operating Systems; Networking; Architecture & Performance; Math and Logic.
2. **Python Programming:** Language & Standard Library; Tooling, Testing & Concurrency.
3. **DSA:** Core Interview Patterns; Advanced Structures & Algorithms; Applied Algorithms & Performance.
4. **Databases:** SQL & Relational Modeling; Transactions, Indexes & Data Infrastructure.
5. **Software Development:** APIs & Application Features; Testing/Debugging/Quality; Code Architecture & Requirements.
6. **System Design:** LLD & Interfaces; HLD & Scalability; Distributed Systems Reasoning.
7. **Security Engineering:** App/API Security; Infrastructure/Operations Security.
8. **Production Engineering & Cloud:** Linux/Docker/Deployment; CI/CD/Observability/Reliability; Cloud/Messaging/Infrastructure.
9. **AI Engineering — Later:** ML Foundations; Generative AI/LLM/RAG; Tool-using Agents & AI Operations.
10. **Professional Engineering:** Debugging/Code Reading/Ownership; Communication/Interview Practice.

## Levels
- **L1** independent small examples, core understanding, use docs freely.
- **L2** robust professional systems, tests, failure analysis, informed designs.
- **L3** advanced architectural/system behavior and justifiable trade-offs.

## Knowledge map rules
- The first eight weeks are an initial sprint, NOT a promise to achieve every unit's L3.
- `priority: later` belongs to the future AI track, but must remain accessible.
- Refer to third-party sources by link only; don't reproduce copyrighted textbook chapters.
- Some unit rubrics intentionally share common mastery standards; each unit's concrete lab, assessment challenge and five skills remain specific.
- External links can change. UI must not crash if an external site is down.
