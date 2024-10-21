/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as NewImport } from './routes/new'
import { Route as LoginImport } from './routes/login'
import { Route as HomepageImport } from './routes/homepage'
import { Route as IndexImport } from './routes/index'
import { Route as JoinInviteCodeImport } from './routes/join/$inviteCode'
import { Route as SlugLayoutImport } from './routes/$slug/_layout'
import { Route as SlugLayoutIndexImport } from './routes/$slug/_layout/index'
import { Route as SlugLayoutSettingsImport } from './routes/$slug/_layout/settings'
import { Route as SlugLayoutSearchImport } from './routes/$slug/_layout/search'
import { Route as SlugLayoutPeopleImport } from './routes/$slug/_layout/people'
import { Route as SlugLayoutIssueIssueIdImport } from './routes/$slug/_layout/issue/$issueId'
import { Route as SlugLayoutInboxLayoutImport } from './routes/$slug/_layout/inbox/_layout'
import { Route as SlugLayoutInboxLayoutIndexImport } from './routes/$slug/_layout/inbox/_layout/index'
import { Route as SlugLayoutInboxLayoutIssueIssueIdImport } from './routes/$slug/_layout/inbox/_layout/issue.$issueId'

// Create Virtual Routes

const SlugImport = createFileRoute('/$slug')()
const SlugLayoutInboxImport = createFileRoute('/$slug/_layout/inbox')()

// Create/Update Routes

const SlugRoute = SlugImport.update({
  id: '/$slug',
  path: '/$slug',
  getParentRoute: () => rootRoute,
} as any)

const NewRoute = NewImport.update({
  id: '/new',
  path: '/new',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const HomepageRoute = HomepageImport.update({
  id: '/homepage',
  path: '/homepage',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const JoinInviteCodeRoute = JoinInviteCodeImport.update({
  id: '/join/$inviteCode',
  path: '/join/$inviteCode',
  getParentRoute: () => rootRoute,
} as any)

const SlugLayoutRoute = SlugLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => SlugRoute,
} as any)

const SlugLayoutInboxRoute = SlugLayoutInboxImport.update({
  id: '/inbox',
  path: '/inbox',
  getParentRoute: () => SlugLayoutRoute,
} as any)

const SlugLayoutIndexRoute = SlugLayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => SlugLayoutRoute,
} as any)

const SlugLayoutSettingsRoute = SlugLayoutSettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => SlugLayoutRoute,
} as any)

const SlugLayoutSearchRoute = SlugLayoutSearchImport.update({
  id: '/search',
  path: '/search',
  getParentRoute: () => SlugLayoutRoute,
} as any)

const SlugLayoutPeopleRoute = SlugLayoutPeopleImport.update({
  id: '/people',
  path: '/people',
  getParentRoute: () => SlugLayoutRoute,
} as any)

const SlugLayoutIssueIssueIdRoute = SlugLayoutIssueIssueIdImport.update({
  id: '/issue/$issueId',
  path: '/issue/$issueId',
  getParentRoute: () => SlugLayoutRoute,
} as any)

const SlugLayoutInboxLayoutRoute = SlugLayoutInboxLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => SlugLayoutInboxRoute,
} as any)

const SlugLayoutInboxLayoutIndexRoute = SlugLayoutInboxLayoutIndexImport.update(
  {
    id: '/',
    path: '/',
    getParentRoute: () => SlugLayoutInboxLayoutRoute,
  } as any,
)

const SlugLayoutInboxLayoutIssueIssueIdRoute =
  SlugLayoutInboxLayoutIssueIssueIdImport.update({
    id: '/issue/$issueId',
    path: '/issue/$issueId',
    getParentRoute: () => SlugLayoutInboxLayoutRoute,
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
    '/homepage': {
      id: '/homepage'
      path: '/homepage'
      fullPath: '/homepage'
      preLoaderRoute: typeof HomepageImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/new': {
      id: '/new'
      path: '/new'
      fullPath: '/new'
      preLoaderRoute: typeof NewImport
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
    '/$slug/_layout/people': {
      id: '/$slug/_layout/people'
      path: '/people'
      fullPath: '/$slug/people'
      preLoaderRoute: typeof SlugLayoutPeopleImport
      parentRoute: typeof SlugLayoutImport
    }
    '/$slug/_layout/search': {
      id: '/$slug/_layout/search'
      path: '/search'
      fullPath: '/$slug/search'
      preLoaderRoute: typeof SlugLayoutSearchImport
      parentRoute: typeof SlugLayoutImport
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
    '/$slug/_layout/inbox': {
      id: '/$slug/_layout/inbox'
      path: '/inbox'
      fullPath: '/$slug/inbox'
      preLoaderRoute: typeof SlugLayoutInboxImport
      parentRoute: typeof SlugLayoutImport
    }
    '/$slug/_layout/inbox/_layout': {
      id: '/$slug/_layout/inbox/_layout'
      path: '/inbox'
      fullPath: '/$slug/inbox'
      preLoaderRoute: typeof SlugLayoutInboxLayoutImport
      parentRoute: typeof SlugLayoutInboxRoute
    }
    '/$slug/_layout/issue/$issueId': {
      id: '/$slug/_layout/issue/$issueId'
      path: '/issue/$issueId'
      fullPath: '/$slug/issue/$issueId'
      preLoaderRoute: typeof SlugLayoutIssueIssueIdImport
      parentRoute: typeof SlugLayoutImport
    }
    '/$slug/_layout/inbox/_layout/': {
      id: '/$slug/_layout/inbox/_layout/'
      path: '/'
      fullPath: '/$slug/inbox/'
      preLoaderRoute: typeof SlugLayoutInboxLayoutIndexImport
      parentRoute: typeof SlugLayoutInboxLayoutImport
    }
    '/$slug/_layout/inbox/_layout/issue/$issueId': {
      id: '/$slug/_layout/inbox/_layout/issue/$issueId'
      path: '/issue/$issueId'
      fullPath: '/$slug/inbox/issue/$issueId'
      preLoaderRoute: typeof SlugLayoutInboxLayoutIssueIssueIdImport
      parentRoute: typeof SlugLayoutInboxLayoutImport
    }
  }
}

// Create and export the route tree

interface SlugLayoutInboxLayoutRouteChildren {
  SlugLayoutInboxLayoutIndexRoute: typeof SlugLayoutInboxLayoutIndexRoute
  SlugLayoutInboxLayoutIssueIssueIdRoute: typeof SlugLayoutInboxLayoutIssueIssueIdRoute
}

const SlugLayoutInboxLayoutRouteChildren: SlugLayoutInboxLayoutRouteChildren = {
  SlugLayoutInboxLayoutIndexRoute: SlugLayoutInboxLayoutIndexRoute,
  SlugLayoutInboxLayoutIssueIssueIdRoute:
    SlugLayoutInboxLayoutIssueIssueIdRoute,
}

const SlugLayoutInboxLayoutRouteWithChildren =
  SlugLayoutInboxLayoutRoute._addFileChildren(
    SlugLayoutInboxLayoutRouteChildren,
  )

interface SlugLayoutInboxRouteChildren {
  SlugLayoutInboxLayoutRoute: typeof SlugLayoutInboxLayoutRouteWithChildren
}

const SlugLayoutInboxRouteChildren: SlugLayoutInboxRouteChildren = {
  SlugLayoutInboxLayoutRoute: SlugLayoutInboxLayoutRouteWithChildren,
}

const SlugLayoutInboxRouteWithChildren = SlugLayoutInboxRoute._addFileChildren(
  SlugLayoutInboxRouteChildren,
)

interface SlugLayoutRouteChildren {
  SlugLayoutPeopleRoute: typeof SlugLayoutPeopleRoute
  SlugLayoutSearchRoute: typeof SlugLayoutSearchRoute
  SlugLayoutSettingsRoute: typeof SlugLayoutSettingsRoute
  SlugLayoutIndexRoute: typeof SlugLayoutIndexRoute
  SlugLayoutInboxRoute: typeof SlugLayoutInboxRouteWithChildren
  SlugLayoutIssueIssueIdRoute: typeof SlugLayoutIssueIssueIdRoute
}

const SlugLayoutRouteChildren: SlugLayoutRouteChildren = {
  SlugLayoutPeopleRoute: SlugLayoutPeopleRoute,
  SlugLayoutSearchRoute: SlugLayoutSearchRoute,
  SlugLayoutSettingsRoute: SlugLayoutSettingsRoute,
  SlugLayoutIndexRoute: SlugLayoutIndexRoute,
  SlugLayoutInboxRoute: SlugLayoutInboxRouteWithChildren,
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
  '/homepage': typeof HomepageRoute
  '/login': typeof LoginRoute
  '/new': typeof NewRoute
  '/$slug': typeof SlugLayoutRouteWithChildren
  '/join/$inviteCode': typeof JoinInviteCodeRoute
  '/$slug/people': typeof SlugLayoutPeopleRoute
  '/$slug/search': typeof SlugLayoutSearchRoute
  '/$slug/settings': typeof SlugLayoutSettingsRoute
  '/$slug/': typeof SlugLayoutIndexRoute
  '/$slug/inbox': typeof SlugLayoutInboxLayoutRouteWithChildren
  '/$slug/issue/$issueId': typeof SlugLayoutIssueIssueIdRoute
  '/$slug/inbox/': typeof SlugLayoutInboxLayoutIndexRoute
  '/$slug/inbox/issue/$issueId': typeof SlugLayoutInboxLayoutIssueIssueIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/homepage': typeof HomepageRoute
  '/login': typeof LoginRoute
  '/new': typeof NewRoute
  '/$slug': typeof SlugLayoutIndexRoute
  '/join/$inviteCode': typeof JoinInviteCodeRoute
  '/$slug/people': typeof SlugLayoutPeopleRoute
  '/$slug/search': typeof SlugLayoutSearchRoute
  '/$slug/settings': typeof SlugLayoutSettingsRoute
  '/$slug/inbox': typeof SlugLayoutInboxLayoutIndexRoute
  '/$slug/issue/$issueId': typeof SlugLayoutIssueIssueIdRoute
  '/$slug/inbox/issue/$issueId': typeof SlugLayoutInboxLayoutIssueIssueIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/homepage': typeof HomepageRoute
  '/login': typeof LoginRoute
  '/new': typeof NewRoute
  '/$slug': typeof SlugRouteWithChildren
  '/$slug/_layout': typeof SlugLayoutRouteWithChildren
  '/join/$inviteCode': typeof JoinInviteCodeRoute
  '/$slug/_layout/people': typeof SlugLayoutPeopleRoute
  '/$slug/_layout/search': typeof SlugLayoutSearchRoute
  '/$slug/_layout/settings': typeof SlugLayoutSettingsRoute
  '/$slug/_layout/': typeof SlugLayoutIndexRoute
  '/$slug/_layout/inbox': typeof SlugLayoutInboxRouteWithChildren
  '/$slug/_layout/inbox/_layout': typeof SlugLayoutInboxLayoutRouteWithChildren
  '/$slug/_layout/issue/$issueId': typeof SlugLayoutIssueIssueIdRoute
  '/$slug/_layout/inbox/_layout/': typeof SlugLayoutInboxLayoutIndexRoute
  '/$slug/_layout/inbox/_layout/issue/$issueId': typeof SlugLayoutInboxLayoutIssueIssueIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/homepage'
    | '/login'
    | '/new'
    | '/$slug'
    | '/join/$inviteCode'
    | '/$slug/people'
    | '/$slug/search'
    | '/$slug/settings'
    | '/$slug/'
    | '/$slug/inbox'
    | '/$slug/issue/$issueId'
    | '/$slug/inbox/'
    | '/$slug/inbox/issue/$issueId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/homepage'
    | '/login'
    | '/new'
    | '/$slug'
    | '/join/$inviteCode'
    | '/$slug/people'
    | '/$slug/search'
    | '/$slug/settings'
    | '/$slug/inbox'
    | '/$slug/issue/$issueId'
    | '/$slug/inbox/issue/$issueId'
  id:
    | '__root__'
    | '/'
    | '/homepage'
    | '/login'
    | '/new'
    | '/$slug'
    | '/$slug/_layout'
    | '/join/$inviteCode'
    | '/$slug/_layout/people'
    | '/$slug/_layout/search'
    | '/$slug/_layout/settings'
    | '/$slug/_layout/'
    | '/$slug/_layout/inbox'
    | '/$slug/_layout/inbox/_layout'
    | '/$slug/_layout/issue/$issueId'
    | '/$slug/_layout/inbox/_layout/'
    | '/$slug/_layout/inbox/_layout/issue/$issueId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  HomepageRoute: typeof HomepageRoute
  LoginRoute: typeof LoginRoute
  NewRoute: typeof NewRoute
  SlugRoute: typeof SlugRouteWithChildren
  JoinInviteCodeRoute: typeof JoinInviteCodeRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  HomepageRoute: HomepageRoute,
  LoginRoute: LoginRoute,
  NewRoute: NewRoute,
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
        "/homepage",
        "/login",
        "/new",
        "/$slug",
        "/join/$inviteCode"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/homepage": {
      "filePath": "homepage.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/new": {
      "filePath": "new.tsx"
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
        "/$slug/_layout/people",
        "/$slug/_layout/search",
        "/$slug/_layout/settings",
        "/$slug/_layout/",
        "/$slug/_layout/inbox",
        "/$slug/_layout/issue/$issueId"
      ]
    },
    "/join/$inviteCode": {
      "filePath": "join/$inviteCode.tsx"
    },
    "/$slug/_layout/people": {
      "filePath": "$slug/_layout/people.tsx",
      "parent": "/$slug/_layout"
    },
    "/$slug/_layout/search": {
      "filePath": "$slug/_layout/search.tsx",
      "parent": "/$slug/_layout"
    },
    "/$slug/_layout/settings": {
      "filePath": "$slug/_layout/settings.tsx",
      "parent": "/$slug/_layout"
    },
    "/$slug/_layout/": {
      "filePath": "$slug/_layout/index.tsx",
      "parent": "/$slug/_layout"
    },
    "/$slug/_layout/inbox": {
      "filePath": "$slug/_layout/inbox",
      "parent": "/$slug/_layout",
      "children": [
        "/$slug/_layout/inbox/_layout"
      ]
    },
    "/$slug/_layout/inbox/_layout": {
      "filePath": "$slug/_layout/inbox/_layout.tsx",
      "parent": "/$slug/_layout/inbox",
      "children": [
        "/$slug/_layout/inbox/_layout/",
        "/$slug/_layout/inbox/_layout/issue/$issueId"
      ]
    },
    "/$slug/_layout/issue/$issueId": {
      "filePath": "$slug/_layout/issue/$issueId.tsx",
      "parent": "/$slug/_layout"
    },
    "/$slug/_layout/inbox/_layout/": {
      "filePath": "$slug/_layout/inbox/_layout/index.tsx",
      "parent": "/$slug/_layout/inbox/_layout"
    },
    "/$slug/_layout/inbox/_layout/issue/$issueId": {
      "filePath": "$slug/_layout/inbox/_layout/issue.$issueId.tsx",
      "parent": "/$slug/_layout/inbox/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
