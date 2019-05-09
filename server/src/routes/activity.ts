import { Route } from "../util/route"
import { getActivities, addActivity, delActivity, getActivityDetail } from "../controller/activity"

export = [new Route({
    cmd: 'getAll',
    handler: [getActivities],
    method: 'get'
}), new Route({
    cmd: 'add',
    handler: [addActivity],
    method: 'post'
}), new Route({
    cmd: 'del',
    handler: [delActivity],
    method: 'post'
}), new Route({
    cmd: 'getDetail',
    handler: [getActivityDetail],
    method: 'post'
})]