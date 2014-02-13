library debiki_admin_routing;

import 'package:angular/angular.dart';

class DebikiAdminRouteInitializer implements RouteInitializer {


  init(Router router, ViewFactory view) {
    router.root
      ..addRoute(
          name: 'allRecentTopics',
          path: '/all-recent-topics',
          enter: view('view/all-recent-topics.html'))
      ..addRoute(
          name: 'allRecentComments',
          path: '/all-recent-comments',
          enter: view('view/all-recent-comments.html'))
      ..addRoute(
          name: 'siteWideSettings',
          path: '/site-wide-settings',
          enter: view('view/site-wide-settings.html'))
      ..addRoute(
          name: 'pages',
          path: '/pages/',
          mount: (Route route) => route
            ..addRoute(
                name: 'pagesComments',
                path: 'recent-comments',
                enter: view('view/pages/recent-comments.html'))
            ..addRoute(
                name: 'pagesSettings',
                path: 'settings',
                enter: view('view/pages/settings.html'))
            ..addRoute(
                name: 'pagesDashboard',
                path: '',
                enter: view('view/pages/dashboard.html')))
      ..addRoute(
          name: 'blog',
          path: '/blog/:blogId/',
          mount: (Route route) => route
            ..addRoute(
                name: 'blogComments',
                path: 'recent-comments',
                enter: view('view/blog/recent-comments.html'))
            ..addRoute(
                name: 'blogSettings',
                path: 'settings',
                enter: view('view/blog/settings.html'))
            ..addRoute(
                name: 'blogDashboard',
                path: '',
                enter: view('view/blog/dashboard.html')))
      ..addRoute(
          name: 'forum',
          path: '/fourm/:forumId/',
          mount: (Route route) => route
            ..addRoute(
                name: 'forumComments',
                path: 'recent-comments',
                enter: view('view/forum/recent-comments.html'))
            ..addRoute(
                name: 'forumSettings',
                path: 'settings',
                enter: view('view/forum/settings.html'))
            ..addRoute(
                name: 'forumDashboard',
                path: '',
                enter: view('view/forum/dashboard.html')))
      ..addRoute(
          name: 'mainDashboard',
          path: '/',
          enter: view('view/main-dashboard.html'))
      ..addRoute(
          name: 'default',
          defaultRoute: true,
          enter: (_) {
              router.go('mainDashboard', {}, replace: false);
          });
  }

}
