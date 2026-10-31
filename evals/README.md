# Orchestrate evaluations

These fixtures separate activation, strategy/reference traversal, execution outcomes, and
compression regressions. Model-driven runs should capture selected files, resolved strategy and
dimensions, spawned-agent count, token use, gate outcomes, and durable artifacts.

The executable side lives in [`bench/`](../bench/README.md): decision replays run an output case
against a frozen run state (each replay names the case it `covers`), and build runs score whole
small apps with hidden tests.
