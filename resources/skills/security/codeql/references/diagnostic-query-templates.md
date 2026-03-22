# Diagnostic Query Templates

Language-specific QL queries for enumerating sources and sinks recognized by CodeQL. Used during the data extensions creation process.

## Source Enumeration Query

All languages use the class `RemoteFlowSource`. The import differs per language.

### Import Reference

| Language | Imports | Class |
|----------|---------|-------|
| Python | `import python` + `import semmle.python.dataflow.new.RemoteFlowSources` | `RemoteFlowSource` |
| JavaScript | `import javascript` | `RemoteFlowSource` |
| Java | `import java` + `import semmle.code.java.dataflow.FlowSources` | `RemoteFlowSource` |
| Go | `import go` | `RemoteFlowSource` |
| C/C++ | `import cpp` + `import semmle.code.cpp.security.FlowSources` | `RemoteFlowSource` |
| C# | `import csharp` + `import semmle.code.csharp.security.dataflow.flowsources.Remote` | `RemoteFlowSource` |
| Ruby | `import ruby` + `import codeql.ruby.dataflow.RemoteFlowSources` | `RemoteFlowSource` |

### Template (Python — swap imports per table above)

```ql
/**
 * @name List recognized dataflow sources
 * @description Enumerates all locations CodeQL recognizes as dataflow sources
 * @kind problem
 * @id custom/list-sources
 */
import python
import semmle.python.dataflow.new.RemoteFlowSources

from RemoteFlowSource src
select src,
  src.getSourceType()
    + " | " + src.getLocation().getFile().getRelativePath()
    + ":" + src.getLocation().getStartLine().toString()
```

**Note:** `getSourceType()` is available on Python, Java, and C#. For Go, JavaScript, Ruby, and C++ replace the select with:
```ql
select src,
  src.getLocation().getFile().getRelativePath()
    + ":" + src.getLocation().getStartLine().toString()
```

---

## Sink Enumeration Queries

The Concepts API differs significantly across languages. Use the correct template.

### Concept Class Reference

| Concept | Python | JavaScript | Go | Ruby |
|---------|--------|------------|-----|------|
| SQL | `SqlExecution.getSql()` | `DatabaseAccess.getAQueryArgument()` | `SQL::QueryString` (is-a Node) | `SqlExecution.getSql()` |
| Command exec | `SystemCommandExecution.getCommand()` | `SystemCommandExecution.getACommandArgument()` | `SystemCommandExecution.getCommandName()` | `SystemCommandExecution.getAnArgument()` |
| File access | `FileSystemAccess.getAPathArgument()` | `FileSystemAccess.getAPathArgument()` | `FileSystemAccess.getAPathArgument()` | `FileSystemAccess.getAPathArgument()` |
| HTTP client | `Http::Client::Request.getAUrlPart()` | — | — | — |
| Decoding | `Decoding.getAnInput()` | — | — | — |
| XML parsing | — | — | — | `XmlParserCall.getAnInput()` |

### Python

```ql
/**
 * @name List recognized dataflow sinks
 * @description Enumerates security-relevant sinks CodeQL recognizes
 * @kind problem
 * @id custom/list-sinks
// ... (24 lines trimmed)
  kind
    + " | " + sink.getLocation().getFile().getRelativePath()
    + ":" + sink.getLocation().getStartLine().toString()
```

### JavaScript / TypeScript

```ql
/**
 * @name List recognized dataflow sinks
 * @description Enumerates security-relevant sinks CodeQL recognizes
 * @kind problem
 * @id custom/list-sinks-js
// ... (17 lines trimmed)
  kind
    + " | " + sink.getLocation().getFile().getRelativePath()
    + ":" + sink.getLocation().getStartLine().toString()
```

### Go

```ql
/**
 * @name List recognized dataflow sinks
 * @description Enumerates security-relevant sinks CodeQL recognizes
 * @kind problem
 * @id custom/list-sinks-go
// ... (16 lines trimmed)
  kind
    + " | " + sink.getLocation().getFile().getRelativePath()
    + ":" + sink.getLocation().getStartLine().toString()
```

### Ruby

```ql
/**
 * @name List recognized dataflow sinks
 * @description Enumerates security-relevant sinks CodeQL recognizes
 * @kind problem
 * @id custom/list-sinks-ruby
// ... (18 lines trimmed)
  kind
    + " | " + sink.getLocation().getFile().getRelativePath()
    + ":" + sink.getLocation().getStartLine().toString()
```

### Java

Java lacks a unified Concepts module. Use language-specific sink classes. The diagnostics query needs its own `qlpack.yml` with a `codeql/java-all` dependency — create it alongside the `.ql` files:

```yaml
# $DIAG_DIR/qlpack.yml
name: custom/diagnostics
version: 0.0.1
dependencies:
  codeql/java-all: "*"
```

Then run `codeql pack install` in the diagnostics directory before executing queries.

```ql
/**
 * @name List recognized dataflow sinks
 * @description Enumerates security-relevant sinks CodeQL recognizes
 * @kind problem
 * @id custom/list-sinks
// ... (24 lines trimmed)
  kind
    + " | " + sink.getLocation().getFile().getRelativePath()
    + ":" + sink.getLocation().getStartLine().toString()
```

### C / C++

C++ uses a similar per-vulnerability-class pattern. Requires a `qlpack.yml` with `codeql/cpp-all` dependency (same approach as Java):

```yaml
# $DIAG_DIR/qlpack.yml
name: custom/diagnostics
version: 0.0.1
dependencies:
  codeql/cpp-all: "*"
```

Then run `codeql pack install` in the diagnostics directory before executing queries.

```ql
/**
 * @name List recognized dataflow sinks
 * @description Enumerates security-relevant sinks CodeQL recognizes
 * @kind problem
 * @id custom/list-sinks-cpp
// ... (33 lines trimmed)
  kind
    + " | " + sink.getLocation().getFile().getRelativePath()
    + ":" + sink.getLocation().getStartLine().toString()
```

### C\#

C# uses per-vulnerability sink classes. Requires a `qlpack.yml` with `codeql/csharp-all` dependency:

```yaml
# $DIAG_DIR/qlpack.yml
name: custom/diagnostics
version: 0.0.1
dependencies:
  codeql/csharp-all: "*"
```

Then run `codeql pack install` in the diagnostics directory before executing queries.

```ql
/**
 * @name List recognized dataflow sinks
 * @description Enumerates security-relevant sinks CodeQL recognizes
 * @kind problem
 * @id custom/list-sinks-csharp
// ... (18 lines trimmed)
  kind
    + " | " + sink.getLocation().getFile().getRelativePath()
    + ":" + sink.getLocation().getStartLine().toString()
```
