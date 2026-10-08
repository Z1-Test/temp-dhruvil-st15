# Decision

* [Decision: Decoupling Core Math Engine from UI Presentation Layer](001-initial-architecture.md) - Chosen architectural approach for isolating mathematical evaluation from presentation frameworks via Hexagonal Architecture.
* [Decision: Arbitrary-Precision Decimal Representation vs IEEE-754 Floating Point](002-numeric-precision-strategy.md) - Chosen numeric precision strategy to eliminate binary floating-point drift and guarantee exact arithmetic across all calculator modes.
* [Decision: AST-Based Expression Evaluation via Shunting-Yard Parser](003-ast-expression-parser.md) - Chosen parsing methodology for infix expression evaluation over immediate-execution accumulators and dynamic eval.
