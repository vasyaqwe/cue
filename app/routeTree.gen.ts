/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as IndexImport } from './routes/index'
import { Route as JoinInviteCodeImport } from './routes/join/$inviteCode'
import { Route as SlugLayoutImport } from './routes/$slug/_layout'
import { Route as SlugLayoutIndexImport } from './routes/$slug/_layout/index'
import { Route as SlugLayoutSettingsImport } from './routes/$slug/_layout/settings'
import { Route as SlugLayoutIssueIssueIdImport } from './routes/$slug/_layout/issue/$issueId'

// Create Virtual Routes

const SlugImport = createFileRoute('/$slug')()

// Create/Update Routes

const SlugRoute = SlugImport.update({
  path: '/$slug',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const JoinInviteCodeRoute = JoinInviteCodeImport.update({
  path: '/join/$inviteCode',
  getParentRoute: () => rootRoute,
} as any)

const SlugLayoutRoute = SlugLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => SlugRoute,
} as any)

const SlugLayoutIndexRoute = SlugLayoutIndexImport.update({
  path: '/',
  getParentRoute: () => SlugLayoutRoute,
} as any)

const SlugLayoutSettingsRoute = SlugLayoutSettingsImport.update({
  path: '/settings',
  getParentRoute: () => SlugLayoutRoute,
} as any)

const SlugLayoutIssueIssueIdRoute = SlugLayoutIssueIssueIdImport.update({
  path: '/issue/$issueId',
  getParentRoute: () => SlugLayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/$slug': {
      id: '/$slug'
      path: '/$slug'
      fullPath: '/$slug'
      preLoaderRoute: typeof SlugImport
      parentRoute: typeof rootRoute
    }
    '/$slug/_layout': {
      id: '/$slug/_layout'
      path: '/$slug'
      fullPath: '/$slug'
      preLoaderRoute: typeof SlugLayoutImport
      parentRoute: typeof SlugRoute
    }
    '/join/$inviteCode': {
      id: '/join/$inviteCode'
      path: '/join/$inviteCode'
      fullPath: '/join/$inviteCode'
      preLoaderRoute: typeof JoinInviteCodeImport
      parentRoute: typeof rootRoute
    }
    '/$slug/_layout/settings': {
      id: '/$slug/_layout/settings'
      path: '/settings'
      fullPath: '/$slug/settings'
      preLoaderRoute: typeof SlugLayoutSettingsImport
      parentRoute: typeof SlugLayoutImport
    }
    '/$slug/_layout/': {
      id: '/$slug/_layout/'
      path: '/'
      fullPath: '/$slug/'
      preLoaderRoute: typeof SlugLayoutIndexImport
      parentRoute: typeof SlugLayoutImport
    }
    '/$slug/_layout/issue/$issueId': {
      id: '/$slug/_layout/issue/$issueId'
      path: '/issue/$issueId'
      fullPath: '/$slug/issue/$issueId'
      preLoaderRoute: typeof SlugLayoutIssueIssueIdImport
      parentRoute: typeof SlugLayoutImport
    }
  }
}

// Create and export the route tree

interface SlugLayoutRouteChildren {
  SlugLayoutSettingsRoute: typeof SlugLayoutSettingsRoute
  SlugLayoutIndexRoute: typeof SlugLayoutIndexRoute
  SlugLayoutIssueIssueIdRoute: typeof SlugLayoutIssueIssueIdRoute
}

const SlugLayoutRouteChildren: SlugLayoutRouteChildren = {
  SlugLayoutSettingsRoute: SlugLayoutSettingsRoute,
  SlugLayoutIndexRoute: SlugLayoutIndexRoute,
  SlugLayoutIssueIssueIdRoute: SlugLayoutIssueIssueIdRoute,
}

const SlugLayoutRouteWithChildren = SlugLayoutRoute._addFileChildren(
  SlugLayoutRouteChildren,
)

interface SlugRouteChildren {
  SlugLayoutRoute: typeof SlugLayoutRouteWithChildren
}

const SlugRouteChildren: SlugRouteChildren = {
  SlugLayoutRoute: SlugLayoutRouteWithChildren,
}

const SlugRouteWithChildren = SlugRoute._addFileChildren(SlugRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/login': typeof LoginRoute
  '/$slug': typeof SlugLayoutRouteWithChildren
  '/join/$inviteCode': typeof JoinInviteCodeRoute
  '/$slug/settings': typeof SlugLayoutSettingsRoute
  '/$slug/': typeof SlugLayoutIndexRoute
  '/$slug/issue/$issueId': typeof SlugLayoutIssueIssueIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/login': typeof LoginRoute
  '/$slug': typeof SlugLayoutIndexRoute
  '/join/$inviteCode': typeof JoinInviteCodeRoute
  '/$slug/settings': typeof SlugLayoutSettingsRoute
  '/$slug/issue/$issueId': typeof SlugLayoutIssueIssueIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/login': typeof LoginRoute
  '/$slug': typeof SlugRouteWithChildren
  '/$slug/_layout': typeof SlugLayoutRouteWithChildren
  '/join/$inviteCode': typeof JoinInviteCodeRoute
  '/$slug/_layout/settings': typeof SlugLayoutSettingsRoute
  '/$slug/_layout/': typeof SlugLayoutIndexRoute
  '/$slug/_layout/issue/$issueId': typeof SlugLayoutIssueIssueIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/login'
    | '/$slug'
    | '/join/$inviteCode'
    | '/$slug/settings'
    | '/$slug/'
    | '/$slug/issue/$issueId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/login'
    | '/$slug'
    | '/join/$inviteCode'
    | '/$slug/settings'
    | '/$slug/issue/$issueId'
  id:
    | '__root__'
    | '/'
    | '/login'
    | '/$slug'
    | '/$slug/_layout'
    | '/join/$inviteCode'
    | '/$slug/_layout/settings'
    | '/$slug/_layout/'
    | '/$slug/_layout/issue/$issueId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  LoginRoute: typeof LoginRoute
  SlugRoute: typeof SlugRouteWithChildren
  JoinInviteCodeRoute: typeof JoinInviteCodeRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  LoginRoute: LoginRoute,
  SlugRoute: SlugRouteWithChildren,
  JoinInviteCodeRoute: JoinInviteCodeRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/login",
        "/$slug",
        "/join/$inviteCode"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/$slug": {
      "filePath": "$slug",
      "children": [
        "/$slug/_layout"
      ]
    },
    "/$slug/_layout": {
      "filePath": "$slug/_layout.tsx",
      "parent": "/$slug",
      "children": [
        "/$slug/_layout/settings",
        "/$slug/_layout/",
        "/$slug/_layout/issue/$issueId"
      ]
    },
    "/join/$inviteCode": {
      "filePath": "join/$inviteCode.tsx"
    },
    "/$slug/_layout/settings": {
      "filePath": "$slug/_layout/settings.tsx",
      "parent": "/$slug/_layout"
    },
    "/$slug/_layout/": {
      "filePath": "$slug/_layout/index.tsx",
      "parent": "/$slug/_layout"
    },
    "/$slug/_layout/issue/$issueId": {
      "filePath": "$slug/_layout/issue/$issueId.tsx",
      "parent": "/$slug/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
