# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in the Baileys community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment:

- Demonstrating empathy and kindness toward other people
- Being respectful of differing opinions, viewpoints, and experiences
- Giving and gracefully accepting constructive feedback
- Accepting responsibility and apologizing to those affected by our mistakes, and learning from the experience
- Focusing on what is best for the overall community

Examples of unacceptable behavior:

- Sexualized language or imagery, or sexual attention or advances of any kind
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## Project-Specific Conduct

Baileys is a dual-use library. It can be used for legitimate automation, bots, and integrations, and it can be used for spam, stalkerware, scraping, and ToS-breaking automation. Contributions whose primary purpose is to enable abuse will be rejected. This includes but is not limited to:

- Bypassing WhatsApp's anti-spam, rate-limiting, or account-restriction mechanisms
- Mass unsolicited messaging features
- Scraping users or contacts without their consent
- Evasion techniques specifically designed to hide automation from WhatsApp

Discussion of how WhatsApp's restrictions work in order to handle them gracefully (e.g., backing off when restricted, surfacing the restriction to the application) is fine and necessary. The line is intent: are we *responding to* the platform's behavior, or *defeating* it?

## AI Policy

This project welcomes AI-assisted contributions. Most of us use them. The rules:

1. **You are the author.** AI tools (Claude, Copilot, Cursor, Codex, ChatGPT, etc.) are tools. The human who opens the PR is responsible for every line in it — correctness, license compatibility, security implications, and adherence to the rest of this Code of Conduct. "The AI wrote it" is not a defense.

2. **Disclose AI use in PRs.** A one-line note in the PR description is enough — for example: *"Drafted with Claude Code, reviewed and tested by me."* You don't need to enumerate every prompt. The point is that reviewers know to look closer at things AI tools commonly get wrong (hallucinated APIs, invented protocol details, plausible-but-wrong refactors).

3. **Review before you submit.** Don't open PRs with code you haven't read. Don't open PRs with code you don't understand well enough to defend in review. If a reviewer asks "why does this work?" and your answer is "the AI suggested it," the PR will be closed.

4. **Test what the AI produced.** Run `yarn lint` and `yarn test` locally. AI tools confidently generate code that doesn't compile or doesn't pass existing tests — catch that before it hits CI.

5. **Don't paste secrets into AI tools.** This includes:
   - `baileys_auth_info/` and any other auth/session state — these contain Signal identity keys equivalent to long-lived credentials
   - `.env` files, API tokens, signing keys
   - Real user phone numbers, message content, or contact lists from production systems
   Most AI providers retain prompts for some period; treat anything you paste as published.

6. **Don't use AI to mass-generate issues, PRs, or comments.** Drive-by AI-generated PRs that "fix" non-bugs, add unnecessary tests, or reformat unrelated code waste maintainer time and will be closed without detailed review. If you're using an autonomous agent, supervise it.

7. **Hallucinated protocol details are a security issue.** Baileys talks to a closed-source server. AI tools will confidently invent stanza shapes, attribute names, and error codes that don't exist. Verify against real captures, the existing test fixtures, or the WAProto definitions before submitting.

8. **License-compatible output only.** If you use an AI tool that may surface code from incompatible licenses (GPL, AGPL, proprietary), don't submit that output. We can't accept it. Baileys is MIT.

Following this policy doesn't slow you down — it just keeps the bar consistent between AI-assisted and hand-written contributions.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the maintainers at **rajeh@reforward.dev**. All complaints will be reviewed and investigated promptly and fairly. The maintainers are obligated to respect the privacy and security of the reporter of any incident.

For security vulnerabilities (which are not Code of Conduct issues), see **[SECURITY.md](SECURITY.md)**.

## Enforcement Guidelines

Maintainers will follow these Community Impact Guidelines in determining the consequences for any action they deem in violation of this Code of Conduct:

### 1. Correction

**Community Impact:** Use of inappropriate language or other behavior deemed unprofessional or unwelcome in the community.

**Consequence:** A private, written warning from the maintainers, providing clarity around the nature of the violation and an explanation of why the behavior was inappropriate. A public apology may be requested.

### 2. Warning

**Community Impact:** A violation through a single incident or series of actions.

**Consequence:** A warning with consequences for continued behavior. No interaction with the people involved, including unsolicited interaction with those enforcing the Code of Conduct, for a specified period of time. Violating these terms may lead to a temporary or permanent ban.

### 3. Temporary Ban

**Community Impact:** A serious violation of community standards, including sustained inappropriate behavior.

**Consequence:** A temporary ban from any sort of interaction or public communication with the community for a specified period of time. Violating these terms may lead to a permanent ban.

### 4. Permanent Ban

**Community Impact:** Demonstrating a pattern of violation of community standards, including sustained inappropriate behavior, harassment of an individual, or aggression toward or disparagement of classes of individuals. Also: contributions or behavior aimed at enabling abuse (see § Project-Specific Conduct).

**Consequence:** A permanent ban from any sort of public interaction within the community.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org/), version 2.1, with project-specific and AI-policy sections added by the Baileys maintainers.
