Hey guys @jakubdrobnik @Míša,

How do you want to handle the standalone action vs. integrating it into "Run Actor"? Since an Actor can support both modes, I'd lean towards integrating it into the existing action. It would also mirror the Console, where you can switch between a standard run and an endpoint call when the Actor supports it.

I did a quick spike in n8n with Claude to see what the UI can do. It could look something like this: we add an Interface field (screen 1) that controls the rest of the form. Set to Input, the node behaves as it does now. Switched to Endpoint, it checks whether the Actor has an OpenAPI schema and, if so, lists its endpoints so the user can call them (screen 2). If the Actor has no server interface, the endpoint list shows that instead (screen 3).

What do you think?
