import { Route } from "../util/route"
import { register, getMembers, upload } from "../controller/index"

export = [new Route({
    cmd: 'register',
    handler: [register],
    method: 'post'
}), new Route({
    cmd: 'getMembers',
    handler: [getMembers],
    method: 'get'
}), new Route({
    cmd: 'upload',
    handler: [upload],
    method: 'post'
})]
