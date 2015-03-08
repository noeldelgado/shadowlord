2.0.0 (2014-02-15)

    - Requiring now adds Class, Module, Interface to global scope (neon)
    - You can now require the stdlib with require('neon/stdlib')
    - Requiring now adds CustomEvent, CustomEventSupport, NodeSupport
      and BubblingSupport to the global scope (stdlib)
    - Major version bump because it's not compatible with 1.x (The other
      was loaded in a namespace)

1.1.0 (2014-01-29)

    - Added stdlib, consisting on:
        - NodeSupport
        - CustomEvent and CustomEventSupport
        - BubblingSupport
    - Added tests for stdlib
    - Moved files to /lib

1.0.0 (2012-06-23)

    - Cleaned up and packed Neon library, used already in production.
      Added usage files, improved documentation.
