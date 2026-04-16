# Design specification

## Summary

Build a mobile-first, multilingual intake screener that helps people who may be affected by Spain's 2026 extraordinary regularisation process understand their likely next step, identify evidence gaps, surface specialist issues early, and reach the right support channel.

This service is not the official government application. It does not determine legal eligibility or immigration status. It provides first-pass triage and guidance.

## Goals

The service should:

- reduce first-contact confusion
- turn a high-stakes process into understandable next steps
- improve the quality of downstream support by collecting the minimum structured information needed for triage and referral
- reduce avoidable workload for support organisations by separating likely straightforward cases from cases that need specialist review
- work well for both self-serve and assisted completion

## Non-goals

The service will not:

- submit an application to the Spanish government
- determine legal eligibility with certainty
- replace legal advice
- collect full case files in version 1
- verify documents in version 1
- manage the full lifecycle of a case
- require account creation before use

## Users

### Primary users

People currently in Spain who believe they may be affected by the regularisation and need help understanding what to do next.

### Assisted users

People completing the screener with help from a volunteer, NGO staff member, union representative, community worker, family member, or friend.

### Support users

Frontline workers who need a structured intake summary, clearer routing, and a quick way to identify evidence gaps and specialist flags.

## Service-form principles

The service should follow these principles throughout the journey, not just on individual screens.

- ask only for information that is genuinely needed for triage, routing, continuity, or a reviewed safeguarding reason
- use one clear question per page by default
- do not require users to re-enter information already provided within the same journey
- preserve entered data across validation errors, navigation, and language changes wherever practical
- treat save-and-return as a normal part of the journey rather than an edge case
- keep guidance, validation, and next steps inside one coherent flow wherever possible
- provide help at the point of need using concise hint text, examples, and supporting guidance attached to the relevant question
- make validation errors precise, actionable, and easy to recover from without forcing a restart
- let users check and change answers before the result is produced
- end completed journeys with a clear outcome, next-step explanation, and summary identifier where implemented
- prefer semantic, browser-native controls and structures that browsers and assistive technologies can understand
- support language switching without progress loss
- use language that reflects the user's situation rather than internal administrative, operational, or legal categories
- avoid mandatory account creation for one-off or low-frequency use unless a stronger need is demonstrated

## Core journey

The implemented journey is code-owned.

- `src/lib/journey/config.ts` is the canonical reference for implemented steps, ordering, route slugs, and branching.
- `src/routes/**` are the canonical reference for implemented page behaviour.
- docs should describe product requirements and deferred work, not duplicate implemented screen-by-screen flow.

Version 1 should follow this flow:

1. start and orientation
1. language and completion mode
1. guided questions
1. support-needs capture where it affects triage or flagging
1. check answers
1. result and next-step plan
1. save, print, or share summary
1. referral or assisted follow-up where applicable

## Version 1 scope

Version 1 includes:

- a responsive web-based screener
- language selection
- self-serve mode and assisted mode
- a one-question-per-page journey
- a check-answers page
- save and resume without mandatory password-account creation
- a user-facing result page
- a support-oriented summary
- print and share options
- routing based on broad geography and support need

Version 1 excludes:

- direct evidence upload
- direct integration with government systems
- appointment booking
- full case management
- automated legal opinion generation
- complex analytics dashboards

## Functional requirements

### Start and orientation

The service must explain:

- what the screener is
- what it is not
- how long it usually takes
- what information may help
- what happens at the end

### Language and completion mode

The service must allow users to choose:

- language
- whether they are completing the screener for themselves or on behalf of someone else

Changing language must not wipe previously entered answers.

### Eligibility signals

The service must capture enough information to estimate broad fit against the currently published policy direction, including:

- whether the person is in Spain now
- a residence timeline detailed enough to infer broad cut-off alignment
- approximate residence timeline
- whether they have applied for asylum or international protection
- where they have, whether it was before the relevant policy cut-off

### Evidence snapshot

The service must ask about evidence categories the person already has access to, without requiring uploads in version 1.

### Specialist flags

The service must identify cases that likely need higher-touch review, including where relevant:

- missing identity documents
- possible criminal-record issues
- asylum-related complexity
- conflicting identity details
- high uncertainty across core answers
- need for urgent human support

### Support needs

The service must capture enough information to identify support needs, including:

- language needs
- child or dependant support needs
- digital help needs
- in-person or phone support needs

If the user asks for follow-up or partner contact, the service must then capture safe communication preferences as part of that follow-up flow.

### Routing data

The service must capture enough location information to support referral, such as province or equivalent routing geography.

### Check answers

The service must provide a check-answers page before showing a result.

The check-answers page must:

- replay answers in plain language
- include clear change links
- support correction without forcing a restart
- preserve existing answers when users edit and return
- be the required step before result generation

### Results and summary

The service must generate:

- a user-facing result
- a simple next-step plan
- a support-oriented summary
- a print or save option
- a summary identifier if that helps continuity

The completed journey must also make clear:

- whether the screener is complete
- what the result means in practice
- what should happen next
- whether and how the person may be contacted
- what reference or summary information the user should keep

## Result states

The service must return a small set of cautious triage outcomes.

Canonical result-state identifiers and decision logic are defined in `docs/triage-rules.md`.

## UX requirements

The service should:

- be short enough for most users to finish in roughly 5 to 8 minutes
- use one clear question per page
- use short hint text where needed
- show progress as steps rather than percentages
- allow “I'm not sure” where uncertainty is common
- avoid asking for exact dates where policy-relevant time buckets and an approximate month are enough for triage
- not require account creation to start
- not require users to re-enter information already provided in the same journey unless there is a specific reviewed reason
- make interruption survivable through save and resume
- keep users inside one coherent journey wherever practical rather than sending them to separate support or explanation flows
- provide help, examples, and clarifying guidance at the point where the user needs them
- make validation failures easy to understand and repair
- work on small screens and low-bandwidth conditions
- preserve answers across validation errors and navigation

## Content requirements

The service must:

- use plain, non-threatening language
- state clearly that it is not the official application
- state clearly that it does not decide immigration status
- avoid definitive negative language such as “not eligible” unless the service is explicitly quoting official rules and has been reviewed for that use
- state clearly that it helps identify next steps and support needs
- state clearly that official rules and processes may change
- avoid internal administrative, legal, or operational language that requires users to think like caseworkers or database managers
- prefer question wording, answer labels, and result text that match the user's real-world situation and task

## Data requirements

Version 1 should store only the minimum structured data needed for triage and referral, such as:

- session ID
- language
- completion mode
- current-in-Spain flag
- derived broad cut-off alignment signal
- approximate residence start date or period
- asylum or protection history flag
- whether any reported asylum or protection application was before the cut-off where relevant
- identity-document categories
- evidence categories present
- dependant or family-support flags
- specialist flags
- support-needs flags
- safe contact preference, where follow-up contact or partner handoff is requested
- routing geography
- consent to share with a partner organisation, where applicable

## Accessibility requirements

The service should aim to meet WCAG 2.2 AA.

At minimum, the implementation should support:

- semantic HTML and browser-native inputs where possible
- programmatically associated labels and help text
- accessible error handling and error summary patterns
- keyboard operability
- screen-reader compatible form structure
- language handling that works with assistive technology
- no unnecessary repeated entry within the same flow
- fieldset and legend structures for grouped controls where appropriate
- identifying input purpose programmatically where relevant so browsers and assistive technologies can help users complete forms

## Service operations

Eligibility logic, routing rules, and user-facing copy must be separable from the core UI implementation.

The product should support:

- updating policy-driven rules without rewriting the UI
- updating referral mappings independently
- versioning the triage logic
- recording when key policy text and outcomes were last reviewed

## Success metrics

### User outcomes

- high completion rate for started screeners
- low abandonment in the first few questions
- a strong share of completed screeners producing a clear next step

### Service outcomes

- reduced time spent on repetitive first-contact intake
- improved completeness of information handed off to support workers
- more consistent routing of straightforward versus specialist cases

### Equity outcomes

- healthy completion and routing rates in assisted mode
- meaningful use across multiple languages
- no major drop-off caused by account, device, or accessibility barriers
