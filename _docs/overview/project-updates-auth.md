# Project Updates

I'm outlining additional requirements. We need to update the documents in \_docs/project-definition and \_docs/phases to account for these new requirements.

## Auth

We want to implement our own auth service. Would like recommendations on what node js framework to use for the auth server, and whether it makes sense to have a separate auth server, or to include this functionality in a monolithic api service. How should authentication work? What are our options? Should we use JWT tokens?

## API server

I want to have an api server that is separate from the main application (which should be in nextjs). What node js framework should we use for this?

## Main application

The main application should be its own service implemented in nextjs.
