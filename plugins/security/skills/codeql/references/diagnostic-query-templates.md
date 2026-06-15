# Diagnostic Query Templates

Use these templates to enumerate the sources and sinks CodeQL already recognizes before you write custom extensions.

## Source Enumeration

All supported languages expose a `RemoteFlowSource`-style abstraction, but the imports differ.

| Language | Imports |
|----------|---------|
| Python | `import python` and `import semmle.python.dataflow.new.RemoteFlowSources` |
| JavaScript / TypeScript | `import javascript` |
| Go | `import go` |
| Java | `import java` and `import semmle.code.java.dataflow.FlowSources` |
| C / C++ | `import cpp` and `import semmle.code.cpp.security.FlowSources` |
| C# | `import csharp` and `import semmle.code.csharp.security.dataflow.flowsources.Remote` |
| Ruby | `import ruby` and `import codeql.ruby.dataflow.RemoteFlowSources` |

Python template:

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

For Go, JavaScript, Ruby, and C++, drop `getSourceType()` and select only the file and line.

## Sink Enumeration Strategy

The sink APIs are not uniform across languages. Use the template that matches the language’s concepts API instead of trying to share one query across all packs.

### Python

```ql
/**
 * @name List recognized dataflow sinks
 * @description Enumerates security-relevant sinks CodeQL recognizes
 * @kind problem
 * @id custom/list-sinks-python
 */
import python
import semmle.python.Concepts

from DataFlow::Node sink, string kind
where
  sink = SqlExecution::range().getSql() and kind = "sql" or
  sink = SystemCommandExecution::range().getCommand() and kind = "command" or
  sink = FileSystemAccess::range().getAPathArgument() and kind = "file" or
  sink = Http::Client::Request::range().getAUrlPart() and kind = "http-client" or
  sink = Decoding::range().getAnInput() and kind = "decoding"
select sink,
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
 */
import javascript
import semmle.javascript.Concepts

from DataFlow::Node sink, string kind
where
  sink = DatabaseAccess::range().getAQueryArgument() and kind = "sql" or
  sink = SystemCommandExecution::range().getACommandArgument() and kind = "command" or
  sink = FileSystemAccess::range().getAPathArgument() and kind = "file"
select sink,
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
 */
import go
import semmle.go.Concepts

from DataFlow::Node sink, string kind
where
  sink = SQL::QueryString::range() and kind = "sql" or
  sink = SystemCommandExecution::range().getCommandName() and kind = "command" or
  sink = FileSystemAccess::range().getAPathArgument() and kind = "file"
select sink,
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
 */
import ruby
import codeql.ruby.Concepts

from DataFlow::Node sink, string kind
where
  sink = SqlExecution::range().getSql() and kind = "sql" or
  sink = SystemCommandExecution::range().getAnArgument() and kind = "command" or
  sink = FileSystemAccess::range().getAPathArgument() and kind = "file" or
  sink = XmlParserCall::range().getAnInput() and kind = "xml"
select sink,
  kind
    + " | " + sink.getLocation().getFile().getRelativePath()
    + ":" + sink.getLocation().getStartLine().toString()
```

## Languages With Per-Pack Setup

Java, C / C++, and C# typically need a dedicated diagnostics pack next to the `.ql` file.

Template:

```yaml
name: custom/diagnostics
version: 0.0.1
dependencies:
  codeql/<language>-all: "*"
```

Use:

- `codeql/java-all` for Java
- `codeql/cpp-all` for C / C++
- `codeql/csharp-all` for C#

Then run:

```bash
codeql pack install
```

inside the diagnostics directory before executing the query.

## Practical Advice

- Start with sources first so you know whether the library model already covers the framework.
- Keep the sink query narrow to one or two vulnerability classes at a time.
- Save the output and compare it with the code you expected to see. Missing entries usually mean you need a different concept class, not a looser query.
