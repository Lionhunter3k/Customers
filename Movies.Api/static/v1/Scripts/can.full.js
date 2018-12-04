//load all desired canjs modules
define([
    'can',
    'can/bubble', 'can/compute', 'can/construct', 'can/control', 'can/deferred', 'can/elements', 'can/event', 'can/fragment', 'can/get_value_and_bind',
    'can/hashchange', 'can/list', 'can/map', 'can/map_helpers', 'can/observe', 'can/proto_compute', 'can/read', 'can/render', 'can/route', 'can/scanner',
    'can/view', 'can/construct/proxy', 'can/construct/super', 'can/control/plugin', 'can/list/promise', 'can/list/sort', 'can/map/app', 'can/map/bubble',
    'can/map/delegate', 'can/map/lazy', 'can/map/list', 'can/map/sort', 'can/model/queue', 'can/util/batch', 'can/util/view_model',
    'can/view/stache', 'can/view/scope', 'can/route/pushstate', 'can/view/autorender'
], function (can) {
    return can;
});