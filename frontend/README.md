# Frontend

This directory represents the frontend boundary of the system.

---

## Implementation

The frontend is implemented using Angular.

---

## Structure

```text
frontend/
├── .vscode                      # Shared VS Code configuration for this project
├── docs/                        # frontend documentation
├── public/                      # Static assets
├── src/                         # Source code
│   ├── app/                     # Application components
│   │   └── core/                # Application shell (layout, guards, core services)
│   │       └── normal-layout/   # Default application layout
│   │           └── header/      # Layout-specific header component
│   ├── index.html               # Main HTML template
│   ├── main.ts                  # Application entry point
│   └── styles.css               # Global styles
├── .editorconfig                # Editor configuration
├── .gitignore                   # Git ignore rules
├── .postcssrc.json              # PostCSS configuration
├── angular.json                 # Angular configuration
├── package-lock.json            # Dependency lock file
├── package.json                 # Dependencies
├── tsconfig.app.json            # TypeScript app config
├── tsconfig.json                # TypeScript base config
├── tsconfig.spec.json           # TypeScript test config
└── README.md
```
