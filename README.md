# n8n Nodes - Apify Integration

This is an n8n community node that integrates [Apify](https://apify.com) with your n8n workflows, enabling seamless web scraping, data extraction, and automation.

[Apify](https://apify.com) is a platform for developers to build, deploy, and publish web automation tools, while [n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation tool that allows you to connect various services.

## Table of Contents

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Resources](#resources)
- [Version History](#version-history)

## Installation

### ⚙️ Prerequisites

- Node.js (recommended: v18.10+)
- pnpm installed globally

---

### 1. Initialize n8n locally

Begin by installing and running n8n to create the necessary configuration directory (`~/.n8n`):

```bash
npm install -g n8n # Skip this step if you already have n8n installed globally
n8n start # This will generate the ~/.n8n directory
```

### 2. Clone & Build the Node Package

Install dependencies and build the node:

```bash
pnpm install
pnpm run build
```

### 3. Link the Custom Node to n8n

Create the `custom` directory inside `~/.n8n` (if it doesn't exist), then symlink your local node package:

```bash
mkdir -p ~/.n8n/custom
ln -s /full/path/to/n8n-nodes-apify ~/.n8n/custom/n8n-nodes-apify # replace full/path/to with the path to your n8n-nodes-apify directory
```

> **Note:** Use the absolute path in the symlink for compatibility.

### 4. Restart n8n

Now that your custom node is linked, start n8n again:

```bash
n8n start
```

---

### 🔁 Making Changes

If you make any changes to your custom node locally, remember to rebuild and restart:

```bash
pnpm run build
n8n start
```

---

## Self-Hosted n8n: Public Webhook URL for triggers

This configuration is required for our service’s trigger functionality to work correctly.

By default, when running locally n8n generates webhook URLs using `localhost`, which external services cannot reach. To fix this:

1. **Set your webhook URL**  
In the same shell or Docker environment where n8n runs, export the `WEBHOOK_URL` to a publicly-accessible address. For example:
  ```bash
  export WEBHOOK_URL="https://your-tunnel.local"
  ```
2. **Restart n8n** 
  ```bash
  pnpm run build
  n8n start
  ```

## Operations

This node supports a wide range of Apify operations, including:

- **Actors**: Manage actors and their runs.
  - Fetch actor collections and objects
  - Run actors synchronously
  - Abort, metamorph, or resurrect runs
  - Retrieve the last run object and its storages
- **Actor Tasks**: Automate tasks associated with actors.
  - Manage task collections and objects
  - Run tasks synchronously and retrieve dataset items
  - Fetch the last run object and its storages
- **Datasets**: Work with Apify datasets.
  - Retrieve dataset collections and specific datasets
  - Fetch dataset items
- **Key-value Store**: Retrieve a key-value store record by a given record key.
- **Triggers**: Trigger a workflow when Actor or run finishes.
  - Automatically start an n8n workflow whenever an Actor or task finishes execution

## Credentials

To authenticate, the node uses an Apify API Key. You'll need to configure this in the n8n credentials section under `apifyApi`.

## Compatibility

This node has been tested with n8n version 1.57.0.

## Usage

1. **Create an Actor**: Set up a new actor on [Apify](https://apify.com).
2. **Set up a Workflow**: Create a new workflow in n8n.
3. **Add the Apify Node**: Insert the Apify node into your workflow.
4. **Configure Credentials**: Enter your Apify API key and actor ID.
5. **Select an Operation**: Choose the desired operation for the node.
6. **Execute the Workflow**: Run the workflow to execute the Apify operation.

## Screenshots

Here are some screenshots showcasing the node in action:

![Screenshot 1](./docs/Screenshot%202024-10-06%20at%2001.54.44.png)
![Screenshot 2](./docs/Screenshot%202024-10-06%20at%2002.04.16.png)

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Apify API Documentation](https://docs.apify.com)

## Version History

Track changes and updates to the node here.
